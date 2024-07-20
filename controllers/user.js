const User = require("../models/user.js");

module.exports.renderSignupForm = async (req, res) => {
    res.render("./users/signup.ejs");
};
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser,(err)=>{
            if(err){
                next(err);
            }
            else{
                req.flash("success", "Welcome to Wander Lust! You Logged In Successfully.");
                res.redirect("/listing");
            }
        });
    } catch (e) {
        req.flash("failure", e.message);
        res.redirect("/signup");
    }
};
module.exports.renderLoginForm = async (req, res) => {
    res.render("./users/login.ejs");
};
module.exports.login = async (req, res) => {
    await req.flash("success", "Welcome back, You are logged in successfully!");
    let redirectUrl = res.locals.redirectUrl || "/listing";
    res.redirect(redirectUrl);
};
module.exports.logout = async (req,res,next)=>{
    req.logout((err) => {
        if(err){
            return next(err);
        }
        else{
            req.flash("success","Logged Out Successfully!");
            res.redirect("/listing");
        }
    })
};