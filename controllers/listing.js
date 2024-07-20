const Listing = require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });
module.exports.index = async (req,res)=>{
    let listings=await Listing.find({});
    res.render("./listings/index.ejs",{listings});
};
module.exports.indexfilter = async (req,res)=>{
    let f = req.params.f;
    let fil = f.charAt(0).toUpperCase() + f.slice(1);
    let listings=await Listing.find({category : `${fil}`});
    res.render("./listings/index.ejs",{listings});
};
module.exports.renderNewForm = (req,res)=>{
    res.render("./listings/new.ejs");
};
module.exports.showThisListing = async (req, res) => {
    let { id } = req.params;
    try {
        let list = await Listing.findById(id)
            .populate({ path: "reviews", populate: { path: "author" } })
            .populate("owner").populate("category");
        if (!list) {
            req.flash("failure", "Listing You Requested For Does Not Exist!");
            return res.redirect("/listing");
        }
        res.render("./listings/show.ejs", { list });
    } catch (err) {
        console.error("Error finding and populating listing:", err);
        req.flash("failure", "Error finding and populating listing!");
        res.redirect("/listing");
    }
};

module.exports.createListing = async (req,res,next)=>{
    let lc = req.body.listing.location;
    let ct = req.body.listing.country;
    let responseCoordinates = await geocodingClient.forwardGeocode({
        query:`${lc}, ${ct}`,
        limit: 1
      })
    .send();
    let url = req.file.path;
    let filename = req.file.filename;
    const newList = new Listing(req.body.listing);
    newList.owner = req.user._id;
    newList.image = {filename,url};
    newList.category = req.body.listing.category;
    newList.geometry = responseCoordinates.body.features[0].geometry;
    let savedList = await newList.save();
    console.log(savedList);
    req.flash("success","New Listing Created!");
    res.redirect("/listing");
};
module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    let list =await Listing.findById(id);
    if(!list){ 
        req.flash("failure","Listing You Requested For, Does not exist!");
        return res.redirect("/listing");
    }
    let originalImageUrl = list.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250"); 
    res.render("./listings/edit.ejs",{list,originalImageUrl});
};
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    try {
        let listing = await Listing.findById(id);

        // Check if listing exists
        if (!listing) {
            req.flash("failure", "Listing not found!");
            return res.redirect("/listing");
        }

        // Update the listing with new data
        listing.set(req.body.listing);
        // Update image if a new file is uploaded
        if (req.file) {
            let url = req.file.path;
            let filename = req.file.filename;
            listing.image = { filename, url };
        }

        // Forward geocode to get updated coordinates
        let lc = req.body.listing.location;
        let ct = req.body.listing.country;
        let responseCoordinates = await geocodingClient.forwardGeocode({
            query: `${lc}, ${ct}`,
            limit: 1
        }).send();
        // Update geometry with new coordinates
        listing.geometry = responseCoordinates.body.features[0].geometry;
        // Save the updated listing
        await listing.save();
        req.flash("success", "Listing Updated Successfully!");
        res.redirect(`/listing/${id}`);
    } catch (err) {
        console.error("Error updating listing:", err);
        req.flash("failure", "Failed to update listing.");
        res.redirect(`/listing/${id}`);
    }
};

module.exports.deleteListing = async (req,res)=>{
    let {id}=req.params;
    let listing = await Listing.findById(id);
    let delList = await Listing.findByIdAndDelete(id);
    console.log(delList);
    req.flash("success","Listing Deleted Successfully!");
    res.redirect("/listing");
};

