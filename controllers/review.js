const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async(req,res)=>{
    let {id}=req.params;
    let list =await Listing.findById(id);
    // Create a new review object
    let newReview = new Review({
        rating: req.body.review.rating, // Ensure rating is provided
        comment: req.body.review.comment,
        author: req.user._id
    });
    list.reviews.push(newReview);
    await newReview.save();
    await list.save();
    console.log("new review saved");
    req.flash("success","New Review Created!");
    res.redirect(`/listing/${id}`);
};

module.exports.destroyReview = async (req,res) =>{
    let {id, reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfully!");
    res.redirect(`/listing/${id}`);
};
