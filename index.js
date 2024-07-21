if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const MyError = require("./utils/MyError.js");
const methodOverride= require("method-override");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const wrapAsync = require("./utils/wrapAsync.js");
//routes
const listingg = require("./routes/listingg.js");
const revieww = require("./routes/revieww.js");
const userr = require("./routes/userr.js");
const listingController = require("./controllers/listing.js");

app.use(methodOverride("_method"));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
// use ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
//css
app.use(express.static(path.join(__dirname,"/public")));
//db connect
async function main(){
    await mongoose.connect(process.env.ATLASDB_URL);
}
main().then((res)=>{
    console.log("connected to db!");
}).catch((err)=>{
    console.log(err);
});
//mongoStore for session
const store = MongoStore.create({
    mongoUrl : process.env.ATLASDB_URL,
    crypto : {
        secret : process.env.SESSION_SECRET,
    },
    touchAfter: 24*3600, //24 hrs
});
//mongo store me error aya to
store.on("error",()=>{
    console.log("Error in mongo session store!", err);
})
//express-session
app.use(session({
    store,
    secret : process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{ 
        //hum chahte hi..7 din baad expire ho..to date.now(millisec) + 7 din in millisec
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true, //for security purposes
    },
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
//middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); //ab is success wale variable ko use krenge views me jake index.ejs ke andar
    res.locals.failure = req.flash("failure");
    //user
    res.locals.currUser = req.user;
    next();
})

app.use("/listing",listingg);
app.use("/listing/:id/reviews",revieww);
app.use("/",userr);
app.get("/",wrapAsync(listingController.index));
//agar koi bhi route match nhi hua.. to hum page not found ka error bhejenge
app.all("*",(req,res,next)=>{
    next(new MyError(404,"Page Not Found!!"));
})

// error handling middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!!"} = err;
    // Set the HTTP status code for the response
    res.status(statusCode);
    // Render the error page using the template engine
    res.render("./errors/error.ejs", { statusCode, message });
})

app.listen(8080,()=>{
    console.log("listening to the port 8080");
});
