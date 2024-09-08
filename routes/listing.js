const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer( { storage });
// const {listingSchema, reviewSchema} = require("../schema.js");
// const ExpressError = require("../utils/ExpressError.js"); 
// const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware");
const listingContoller = require("../controllers/listing.js");

router.route("/")
    .get(wrapAsync(listingContoller.index))
    .post(isLoggedIn, upload.single("listing[image]"), validateListing, wrapAsync(listingContoller.createListing)

    // , validateListing  
    //this is for when you wnat to upload a image url
    // .post(upload.single('listing[image]'), (req, res) => {
    //     res.send(req.file);
    // })
);

//create new listing
router.get("/new", isLoggedIn, listingContoller.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingContoller.showListing))
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingContoller.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingContoller.destroyListing));

// index route
// router.get("/", wrapAsync(listingContoller.index));


//show
// router.get("/:id", wrapAsync(listingContoller.showListing));

//Create route - inorder to avoid the above lengthy code we use the Joi package
// router.post("/", isLoggedIn, validateListing,  wrapAsync(listingContoller.createListing));



//edit
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingContoller.renderEditForm)); 

//update
// router.put("/:id", isLoggedIn, isOwner, validateListing, wrapAsync(listingContoller.updateListing));

//Delete
// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingContoller.destroyListing));

module.exports = router;
