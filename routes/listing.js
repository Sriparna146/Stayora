const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js"); // .. because listing.js is inside a folder and app.js is outside the folder so we use only . there
const wrapAsync = require("../utils/wrapAsync.js");

const {isLoggedIn , isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
    .route("/")
    .get( wrapAsync(listingController.index))
    .post( 
    isLoggedIn,
    upload.single("Listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
    // .post(upload.single("Listing[image]"), (req, res) => {
    // res.send(req.file);
    // }
    );


//new route  --> if we do not place it before :id path then it show the new as :id
router.get("/new", isLoggedIn, wrapAsync(listingController.renderNewForm));


router.route("/:id")
    .get( wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single("Listing[image]"),validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));



//Index route
//router.get("/", wrapAsync(listingController.index));


//show route
//router.get("/:id", wrapAsync(listingController.showListing));

//create route
// router.post("/", 
//     isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing)
// );

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditform));

//update route
//router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//Delete route
//router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;