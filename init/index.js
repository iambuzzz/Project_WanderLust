const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("C:/Users/Anand/Desktop/Coding/DeV/WebD/MajorProject_WanderLust/models/listing.js");
async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main().then((res)=>{
    console.log("connected to db!");
}).catch((err)=>{
    console.log(err);
});

const initDB = async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({ ...obj, owner : "6694cdcece29ed1b1c373938"}))
    Listing.insertMany(initdata.data);
    console.log("data was initialised");
};
initDB();