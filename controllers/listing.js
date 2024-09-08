const {listingSchema, reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js"); 
const Listing = require("../models/listing.js");

module.exports.index = async (req, res, next) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings}); 
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author",
            model: "User"
        }
    })
    .populate('owner');

    if(!listing) 
    {
        req.flash("error", "Listing Does Not Exists !!!");
        res.redirect("/listings");  
    }
    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res, next) => {
    // let {title, description , image, price, country, location} = req.body; 
        // let result = listingSchema.validate(req.body);
        // console.log(result);
        // if(result.error){ 
        //     throw new ExpressError(400, result.error );
        // }
        
        let url = req.file.path;
        let filename = req.file.filename;
        // console.log(url);
        // console.log(filename);
        const listing = req.body.listing;
        const newListing = new Listing(listing);
        newListing.owner = req.user._id;
        newListing.image = {url, filename};
        // console.log(req.user);
        await newListing.save();
        req.flash("success", "New Listing Created !!!");
        res.redirect("/listings");  
  }

module.exports.renderEditForm = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing)
    {
        req.flash("error", "Listing Does Not Exists !!!");
        res.redirect("/listings");
    }

    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs", { listing, originalImageUrl });
}

module.exports.updateListing = async(req, res) => {
    let { id } = req.params; 
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing })
    
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url, filename};
    await listing.save(); 
    }

    
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted !!!");
    res.redirect("/listings");
}