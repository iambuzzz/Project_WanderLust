const express = require("express");
//router object
const router = express.Router();
//wrapAsync
const wrapAsync = require("../utils/wrapAsync.js");
//middleware function
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({storage});

//INDEX ROUTE & //CREATE ROUTE
router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn ,upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing))
    ;

//indexFilterRoute
router.get("/filter/:f",listingController.indexfilter);
//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

//SHOW ROUTE & //UPDATE ROUTE
router
    .route("/:id")
    .get(wrapAsync(listingController.showThisListing))
    .put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing ,wrapAsync(listingController.updateListing));

//EDIT ROUTE
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

//DELETE ROUTE
router.delete("/:id/delete",isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;



