const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js"); 


const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(MONGO_URL);
}
 
const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "6692b11df2a247dcfa09e6c4"})); //we map a owner of each listing instead of going and separately assigning the lisiting wiht user.
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
}

initDB();

