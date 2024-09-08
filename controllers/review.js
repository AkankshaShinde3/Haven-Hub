const Listing = require("../models/listing") 
const Review = require("../models/review.js");


module.exports.createReview = async (req, res) => {

    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    let result = listing.reviews.push(newReview);
    newReview.author = req.user._id;
    console.log(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success", "New Review Created !!!");

    // console.log("New Review saved");
    // res.send("new review saved");  
    res.redirect(`/listings/${listing._id}`);
}

module.exports.destroyReview = async (req, res) => {
    let {id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId); 
    req.flash("success", "Review Deleted !!!");
    res.redirect(`/listings/${id}`);
}

