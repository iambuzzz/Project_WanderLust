const express = require("express");
const router = express.Router();
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync.js");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//signup Route
router
    .route("/signup")
    .get(wrapAsync(userController.renderSignupForm))
    .post(wrapAsync(userController.signup))
    ;

//login Route
router
    .route("/login")
    .get(wrapAsync(userController.renderLoginForm))
    .post(saveRedirectUrl, passport.authenticate("local",{failureRedirect: '/login',failureFlash: true}), wrapAsync(userController.login))
    ;

//logout route
router.get("/logout", wrapAsync(userController.logout));

module.exports = router;
