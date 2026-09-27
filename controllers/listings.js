const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async(req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
};

module.exports.renderNewForm = async(req,res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id)
    //nested populate for reviews
    .populate({path:"reviews",
        populate :{
            path:"author"
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","Listing you request for does not exist");
        return res.redirect("/Listings");
    }
    res.render("listings/show.ejs", {listing});
};


module.exports.createListing = async(req,res,next) => {


        let response = await geocodingClient
            .forwardGeocode({
                query: req.body.Listing.location,
                limit: 1,
            })
            .send();


        let url = req.file.path;
        let filename = req.file.filename;
       
        
    //let {title,price,location} = req.body;
        //console.log(res.body)
        const newListing = new Listing(req.body.Listing);
        // if(!newListing.title){
        //     throw new ExpressError(400 , "Title is missing");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400 , "Description is missing");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400 , "Location is missing");
        // }
       
        newListing.owner = req.user._id;
        newListing.image = {url,filename};

        newListing.geometry = response.body.features[0].geometry;

        let saveListing = await newListing.save();
        console.log(saveListing);
        req.flash("success","New Listing Created!");
        res.redirect("/Listings");   
    };

    module.exports.renderEditform = async(req,res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        if(!listing){
            req.flash("error","Listing you request for does not exist");
            return res.redirect("/Listings");
        }

        let originalImageUrl = listing.image.url;
        originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", {listing , originalImageUrl});
    };

    module.exports.updateListing = async(req,res) => {
    // if(!req.bod.Listing){
    //     throw new ExpressError(400 , "Send valis data for Listing");
    // }
    let {id} = req.params;
    // let listing = await Listing.findById(id);
    // if (!listing.owner.equals(res.locals.currUser._id)) {
    //     req.flash("error", "You don't have permission to edit");
    //     return res.redirect(`/Listings/${id}`);
    // }

    let listing = await Listing.findByIdAndUpdate(id, {...req.body.Listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success","Listing Updated!");
    res.redirect(`/Listings/${id}`);
};

module.exports.destroyListing = async(req,res) => {
    let {id} = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success","Listing deleted!");
    res.redirect("/Listings");
};