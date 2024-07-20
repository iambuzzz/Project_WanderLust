const express = require("express");
//router object
const router = express.Router({mergeParams:true});
//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn ,validateReview, isAuthor} = require("../middleware.js");
const reviewController = require("../controllers/review.js");
//Create review route
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));
//Delete Route for review
router.delete("/:reviewId",isLoggedIn,isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;