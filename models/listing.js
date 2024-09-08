const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;
const User = require('./user.js');

const defaultImageUrl = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
const listingSchema = new Schema({
    title: 
    {
        type: String,
        required: true, 
    },
    description: String,
    image: 
    {
        url: String,
        filename: String,
        // type: String,
        // default: defaultImageUrl,
        // set: (v) => v === "" ? defaultImageUrl : v,
    },
    price: Number,
    country: String,
    location: String,
    //here we are storing reviews to a particular listing that is one to many relation by creating a array for each listing
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}); 

listingSchema.post("findOneAndDelete", async (listing ) => {
    if(listing)
    {
        await Review.deleteMany({_id : {$in: listing.reviews} });
    }    
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;

//how to make schema
// const orderSchema = new Schema({
//     item: String,
//     price: Number,
// })
// const order = mongoose.model("order", orderSchema);

// const addorders = async order.insertMany({
//     {item: "paniPuri", price: 35}, //silver tub
//     {item: "vadapav", 14,},
//     {item: "samosa", price: 14},
// });

// //schema for CUSTOMERS
// const cutomer = new Schema({  //form
//     name: String,
//     age: Number,
//     City: String,
//     PhoneNo: Number,
// });

// const consumer = mongoose.model("consumer", cutomer); //this is like client side and server side connectino

// //fill the form
// const user1 = async consumer.insertMany({
//     name: "akanksha",
//     age: 20,
//     City: "mumbai",
//     PhoneNo: 1234567789,
// });
