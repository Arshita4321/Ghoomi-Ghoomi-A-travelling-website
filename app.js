
if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate"); 
//const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//const {listingSchema, reviewSchema} = require("./schema.js");
const Review  = require("./models/reviews.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

// const dbUrl = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to DB");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect(mongo_url);
}

// async function main() {
//     await mongoose.connect(dbUrl);
// }

app.use(methodOverride("_method"));

// app.get("/", (req,res) => {
//     res.send("Hi, iam root ");           
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 *24 *60 *60 *1000,
        maxAge : 7 * 24 *60 *60 * 1000,
        httpOnly: true,
    },
};
app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy (User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
    
// // ============== Create Route ===========
// app.post("/listings", async (req,res, next) =>{
//    //  let {title, description, image, price, country, location}= req.body;
//     try {
//         const newListing = new Listing(req.body.listing);
//     await newListing.save();
//     res.redirect("/listings");
//     } catch (err) {
//         next(err);
//     }
   
// });
 // ================    WrapAsync ==========
//app.post("/listings",validateListing, wrapAsync(async (req,res, next) =>{
    
   // //  let {title, description, image, price, country, location}= req.body;
    // if(!req.body.listing) {
    //     throw new ExpressError(400, "Send Valid data for listings");
    // }
//     const newListing = new Listing(req.body.listing);
//      await newListing.save();
//      res.redirect("/listings");
    
//  })
//  );
app.use((req,res,next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    
    res.locals.currUser = req.user;
    next();
})   ;

// app.get("/demouser", async(req, res) => {
//     let fakeUser = new User ({
//         email: "student@gmail.com",
//         username: "delta-student"
//     });

//    let registeredUser =  User.register(fakeUser, "helloworld");
//     res.send(registeredUser);
// })



app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

// reviews 



// app.get("/testListing", async (req, res) => {
//     let sampleListing = new Listing({
//         title: "My new Villa",
//         description: "By the beach",
//         price: 1200,
//         location: "Calangute, Goa",
//         country: "India",
//     })     ;
//    await sampleListing.save()      ;
//    console.log("sample was saved");
//    res.send("successful testing");
// });

app.all("*", (req,res,next) => {
    next(new ExpressError(404, "Page not Found"));
});


//      Custom error handler middleware
app.use((err, req, res, next) => {
    let {statusCode = 500, message = "Something went wrong"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs", {err});
    console.log(err);
});


app.listen(8080, () => {
    console.log("server is listenig to the port 8080");
});



// if(process.env.NODE_ENV != "production"){
//     require('dotenv').config();
// }

// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const Listing = require("./models/listing.js");
// const path = require("path");
// const methodOverride = require("method-override");
// const ejsMate = require("ejs-mate"); 
// //const wrapAsync = require("./utils/wrapAsync.js");
// const ExpressError = require("./utils/ExpressError.js");

// const session = require("express-session");
// const flash = require("connect-flash");
// const passport = require("passport");
// const LocalStrategy = require("passport-local");
// const User = require("./models/user.js");

// //const {listingSchema, reviewSchema} = require("./schema.js");
// const Review  = require("./models/reviews.js");

// const listingsRouter = require("./routes/listing.js");
// const reviewsRouter = require("./routes/review.js");
// const userRouter = require("./routes/user.js");

// const mongo_url = "mongodb://127.0.0.1:27017/wanderlust";

// // const dbUrl = process.env.ATLASDB_URL;

// main().then(() => {
//     console.log("connected to DB");
// }).catch((err) => {
//     console.log(err);
// });

// async function main() {
//     await mongoose.connect(mongo_url);
// }

// // async function main() {
// //     await mongoose.connect(dbUrl);
// // }

// app.use(methodOverride("_method"));

// // app.get("/", (req,res) => {
// //     res.send("Hi, iam root ");           
// // });

// app.set("view engine", "ejs");
// app.set("views", path.join(__dirname, "views"));
// app.use(express.urlencoded({extended: true}));
// app.engine("ejs", ejsMate);
// app.use(express.static(path.join(__dirname, "/public")));

// const sessionOptions = {
//     secret: "mysupersecretcode",
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         expires: Date.now() + 7 *24 *60 *60 *1000,
//         maxAge : 7 * 24 *60 *60 * 1000,
//         httpOnly: true,
//     },
// };
// app.use(session(sessionOptions));
// app.use(flash())

// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy (User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());
    
// // // ============== Create Route ===========
// // app.post("/listings", async (req,res, next) =>{
// //    //  let {title, description, image, price, country, location}= req.body;
// //     try {
// //         const newListing = new Listing(req.body.listing);
// //     await newListing.save();
// //     res.redirect("/listings");
// //     } catch (err) {
// //         next(err);
// //     }
   
// // });
//  // ================    WrapAsync ==========
// //app.post("/listings",validateListing, wrapAsync(async (req,res, next) =>{
    
//    // //  let {title, description, image, price, country, location}= req.body;
//     // if(!req.body.listing) {
//     //     throw new ExpressError(400, "Send Valid data for listings");
//     // }
// //     const newListing = new Listing(req.body.listing);
// //      await newListing.save();
// //      res.redirect("/listings");
    
// //  })
// //  );
// app.use((req,res,next) => {
//     res.locals.success = req.flash("success");
//     res.locals.error = req.flash("error");
    
//     res.locals.currUser = req.user;
//     next();
// })   ;

// // app.get("/demouser", async(req, res) => {
// //     let fakeUser = new User ({
// //         email: "student@gmail.com",
// //         username: "delta-student"
// //     });

// //    let registeredUser =  User.register(fakeUser, "helloworld");
// //     res.send(registeredUser);
// // })



// app.use("/listings", listingsRouter);
// app.use("/listings/:id/reviews", reviewsRouter);
// app.use("/", userRouter);

// // reviews 



// // app.get("/testListing", async (req, res) => {
// //     let sampleListing = new Listing({
// //         title: "My new Villa",
// //         description: "By the beach",
// //         price: 1200,
// //         location: "Calangute, Goa",
// //         country: "India",
// //     })     ;
// //    await sampleListing.save()      ;
// //    console.log("sample was saved");
// //    res.send("successful testing");
// // });

// app.all("*", (req,res,next) => {
//     next(new ExpressError(404, "Page not Found"));
// });


// //      Custom error handler middleware
// app.use((err, req, res, next) => {
//     let {statusCode = 500, message = "Something went wrong"} = err;
//     // res.status(statusCode).send(message);
//     res.status(statusCode).render("error.ejs", {err});
//     console.log(err);
// });


// app.listen(8080, () => {
//     console.log("server is listenig to the port 8080");
// });

