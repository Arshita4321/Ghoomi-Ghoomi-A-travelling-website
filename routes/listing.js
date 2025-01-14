const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, isOwner,validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage});


router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
upload.single("listing[image]"),validateListing,
 wrapAsync(listingController.createListing));

// ============ NEW ROUTE  ========== 

// router.get("/new",isLoggedIn, (req,res) => {
//     res.render("listings/new.ejs");
// });


//controller 
router.get("/new",isLoggedIn, listingController.renderNewForm);


router.route("/:id")
.get(  wrapAsync(listingController.showListing))
.put( isLoggedIn,isOwner,
upload.single("listing[image]"),
validateListing,  wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


// // ======== index route ===========
// router.get("/", wrapAsync(listingController.index));



// =============== SHOW ROUTE =======

// router.get("/:id",  wrapAsync(async (req, res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id)
//     .populate({
//         path: "reviews",
//         populate: {
//             path: "author",
//         },
//     })
//     .populate("owner");
    
//     if(!listing) {
//         req.flash("error", " This Listing Doesn't Exists !");
//         res.redirect("/listings");
//     }
//     console.log(listing);
//     res.render("listings/show.ejs", {listing});
// }));

//controller 

// router.get("/:id",  wrapAsync(listingController.showListing));

// ============== Create Route ===========

// router.post("/", isLoggedIn,validateListing, wrapAsync(async (req,res, next) =>{
//     const newListing = new Listing(req.body.listing);
//     newListing.owner = req.user._id;
//      await newListing.save();
//      req.flash("success", "New Listing created !");
//      res.redirect("/listings");
    
//  })
//  );

//controller 

// router.post("/", isLoggedIn,validateListing, wrapAsync(listingController.createListing));

// ==============   UPDATE : edit and update route ====

// router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync( async (req,res) => {
//     let {id} = req.params;
//     const listing = await Listing.findById(id);

//     if(!listing) {
//         req.flash("error", " This Listing Doesn't Exists !");
//         res.redirect("/listings");
//     }
    
//     res.render("listings/edit.ejs", {listing});
// }));

//controller 
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// ========= Update Route ========

// router.put("/:id", isLoggedIn,isOwner, validateListing,  wrapAsync(async(req,res) => {
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "Send Valid data for listings");
//     // }

//     //       Authorization to make changes
//     // let {id} = req.params;
//     // let listing= await Listing.findById(id);
//     // if(!listing.owner._id.equals(res.locals.currUser._id)) {
//     //     req.flash("error", "You don't have permission to edit");
//     //     return res.redirect(`/listings/${id}`);
//     // }
//     let {id} = req.params; 
//     await Listing.findByIdAndUpdate(id, {...req.body.listing});

//     req.flash("success", "Listing Updated !");
//     res.redirect(`/listings/${id}`);
// }));


//controller 

// router.put("/:id", isLoggedIn,isOwner, validateListing,  wrapAsync(listingController.updateListing));


// ======== delete route ======== 

// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(async(req,res) => {
//     let {id} =req.params;
//     let deletedListing = await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     req.flash("success", " Listing deleted !");
//     res.redirect("/listings");
// }));

//controller 
// router.delete("/:id", isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;