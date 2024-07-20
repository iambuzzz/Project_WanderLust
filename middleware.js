const Listing = require("./models/listing.js");
const MyError = require("./utils/MyError.js");
const { listingSchema, reviewSchema} = require('./schema.js');
const Review = require("./models/review.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        //jis path ko hum access krna chah rhe the usse as redirect url store kr lenge seesion ke andar ek variable me..
        //but passport session ko delete kr deta hi..login ke baad to hum usse locals me store kr lenge..kyuki passport ke paas locals ko delete krne ki access nhi hi
        //to isko store krwane ke liye ek aur middleware create kr lete hi
        req.session.redirectUrl = req.originalUrl; 

        req.flash("failure","You must be logged In!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
    let {id}=req.params;
    let list =await Listing.findById(id);
    if(!list.owner._id.equals(res.locals.currUser._id)){
        req.flash("failure","Yor are not the Owner of this Listing!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.isAuthor = async(req,res,next)=>{
    let {id,reviewId}=req.params;
    let review =await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("failure","Yor are not the Author of this Review!");
        return res.redirect(`/listing/${id}`);
    }
    next();
};
//middleware function
module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        // Handle validation error
        throw new MyError(400, error);
    } else {
        next();
    }
};
//middleware function
module.exports.validateReview = (req,res,next) =>{
    let {error}=reviewSchema.validate(req.body); //kya req.body ke andar ka data valid hi!
    if(error){ //agar koi error aye to throw
        throw new MyError(400, error);
    }
    else{
        next();
    }
};