if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}//development phase me use krenge dotenv ko
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const ejsMate = require("ejs-mate");
//wrapAsync
const wrapAsync = require("./utils/wrapAsync.js");
//MyError class
const MyError = require("./utils/MyError.js");
//Method Override
const methodOverride= require("method-override");
//joi listing schema
const Joi = require('joi');
const {listingSchema, reviewSchema } = require("./schema.js");
//review model
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingg = require("./routes/listingg.js");
const revieww = require("./routes/revieww.js");
const userr = require("./routes/userr.js");


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
    // await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
    await mongoose.connect(process.env.ATLASDB_URL);
}

main().then((res)=>{
    console.log("connected to db!");
}).catch((err)=>{
    console.log(err);
});
// const store = MongoStore.create({
//     mongoUrl : process.env.ATLASDB_URL,
//     crypto : {
//         secret : "mySuperSecretCode",
//     },
//     touchAfter: 24*3600,
// });
// store.on("error",()=>{
//     console.log("Error in mongo session store!", err);
// })
app.use(session({
    // store,
    secret : "mySuperSecretCode",
    resave:false,
    saveUninitialized:false,
    cookie:{ 
        //hum chahte hi..7 din baad expire ho..to date.now(millisec) + 7 din in millisec
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true, //for security purposes
    },
}));

// app.use(session(sessionObject));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));//passport ke andar jo humne nayi localstrategy create ki hi..mtlb jitne bhi users aaye wo local strategy ke through authenticate hone chahiye
passport.serializeUser(User.serializeUser());//session me user ki info store krne ke liye
passport.deserializeUser(User.deserializeUser());//session se user ki info hatane ke liye
//middleware for flash
app.use((req,res,next)=>{
    res.locals.success = req.flash("success"); //ab is success wale variable ko use krenge views me jake index.ejs ke andar
    res.locals.failure = req.flash("failure");
    //user
    res.locals.currUser = req.user;
    next();
})
//demo user create krenge
// app.get("/fakeuser",async (req,res)=>{
//     let fakeUser = new User({
//         email:"student@gmail.com",
//         username: "delta123",
//     });
//     let registerdUser = await User.register(fakeUser,"HelloWorld"); //isko db me save krwa dega with password HelloWorld
//     res.send(registerdUser);
// });



//SAMPLE DATA
// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"Villa",
//         description:"By the Beach",
//         price:5000,
//         location:"Goa",
//         country:"India",
//     });
//     await sampleListing.save().then(()=>{
//         console.log("sample was saved");
//     });
//     res.send("working test");
// });

//middleware function
// const validateListing = (req,res,next) =>{
//     let {error}=listingSchema.validate(req.body); //kya req.body ke andar ka data valid hi!
//     if(error){ //agar koi error aye to throw
//         throw new MyError(400, error);
//     }
//     else{
//         next();
//     }
// }
// const validateReview = (req,res,next) =>{
//     let {error}=reviewSchema.validate(req.body); //kya req.body ke andar ka data valid hi!
//     if(error){ //agar koi error aye to throw
//         throw new MyError(400, error);
//     }
//     else{
//         next();
//     }
// }
app.use("/listing",listingg);
app.use("/listing/:id/reviews",revieww);
app.use("/",userr);



//INDEX ROUTE
// app.get("/listing",wrapAsync(async (req,res)=>{
//     let listings=await Listing.find({});
//     res.render("./listings/index.ejs",{listings});
// }));

//NEW ROUTE
// app.get("/listing/new",(req,res)=>{
//     res.render("./listings/new.ejs");
// });

//SHOW ROUTE
// app.get("/listing/:id",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let list =await Listing.findById(id).populate("reviews");
//     console.log(list.title);
//     res.render("./listings/show.ejs",{list});
// }));

//CREATE ROUTE
// app.post("/listing", validateListing , wrapAsync(async (req,res,next)=>{
//     //joi
//     // let result=listingSchema.validate(req.body); //kya req.body ke andar ka data valid hi!
//     // // console.log(result);
//     // if(result.error){
//     //     throw new MyError(400, result.error);
//     // }
//     const newList = new Listing(req.body.listing);
//     //ab create route me .. agar hoppscotch se hum post req.. localhost:8080/listing pe req bheje.. mtlb without kisi listing object ke.. to.. hum error bhejenge.. 400 -> clientside se koi error hua hi
//     // if(!req.body.listing){
//     //     throw new MyError(400,"Send Valid Data for Listing!");
//     // }
//     // //individual validation error -> jisko joi use krne ke baad comment out kr diya
//     // if(!newList.title){
//     //     throw new MyError(400,"Title is missing!");
//     // }
//     // if(!newList.description){
//     //     throw new MyError(400,"Description is missing!");
//     // }if(!newList.location){
//     //     throw new MyError(400,"Location is missing!");
//     // }
//     // if(!newList.price){
//     //     throw new MyError(400,"Price is missing!");
//     // }
//     // if(!newList.country){
//     //     throw new MyError(400,"Country is missing!");
//     // }
//     //koi error nhi hi to save krlenge
//     await newList.save();
//     console.log("new data entered in db!");
//     res.redirect("/listing");
// }))

//EDIT ROUTE
// app.get("/listing/:id/edit",wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let list =await Listing.findById(id);
//     res.render("./listings/edit.ejs",{list});
// }));

//UPDATE ROUTE
// app.put("/listing/:id",validateListing ,wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listing/${id}`);
// }));

//DELETE ROUTE
// app.delete("/listing/:id", wrapAsync(async (req,res)=>{
//     let {id}=req.params;
//     let delList = await Listing.findByIdAndDelete(id);
//     console.log(delList);
//     res.redirect("/listing");
// }));

//Create review route
// app.post("/listing/:id/reviews",validateReview, wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let list =await Listing.findById(id);
//     let newReview = new Review(req.body.review); //jo review object hi..jisme ratings aur comments hi
//     list.reviews.push(newReview);
//     await newReview.save();
//     await list.save();
//     console.log("new review saved");
//     res.redirect(`/listing/${id}`);
// }))

//Delete Route for review
// app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req,res) =>{
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull : {reviews: reviewId}})
//     //jisse bhi review id match kr jaye use pull kr lenge..  mtlb delete kr denge
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listing/${id}`);
// }))

// //error route
// app.get("/listings/error",(req,res)=>{
//     res.render("./errors/error.ejs");
// });
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
    // res.status(statusCode).send(message);
})

app.listen(8080,()=>{
    console.log("listening to the port 8080");
});
