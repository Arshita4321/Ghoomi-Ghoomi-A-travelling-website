const express = require("express");
const router = express.Router({mergeParams: true});
const User = require("../models/user.js"); 
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(
saveRedirectUrl,
 passport.authenticate("local", {
failureRedirect: "/login",
failureFlash: true }), userController.login );

// ============== signup ==========================
// router.get("/signup", (req, res) => {
//     res.render("users/signup.ejs");
// });


// // = for controller ====== 
// router.get("/signup", userController.renderSignupForm);

// router.post("/signup", wrapAsync(userController.signup));


// router.get("/login", (req, res) => {
//     res.render("users/login.ejs");
// })
// ================ login ============
// // == for controller =============

// router.get("/login",userController.renderLoginForm);

// router.post("/login",
// saveRedirectUrl,
//  passport.authenticate("local", {
// failureRedirect: "/login",
// failureFlash: true }), userController.login
// // async(req,res) => {
// //     req.flash("success", "Welcome to Wanderlust! You are logged in successfully!");
// //     let redirectUrl = res.locals.redirectUrl || "/listings";
// //     res.redirect(redirectUrl);}
// );



// router.get("/logout", (req,res, next) => {
//     req.logout((err) => {
//         if(err) {
//             return next(err);
//         }
//         req.flash("success", "You are logged out successfully");
//         res.redirect("/listings");
//     })
// })

// for cotroller =======

router.get("/logout", userController.logout);


module.exports = router;