if(process.env.NODE_ENV != "production")
{
    require('dotenv').config();
}

const express = require('express');
const app = express();
const port = process.env.PORT;
const mongoose = require('mongoose');
const path = require("path"); 
const methodOverride = require('method-override'); 
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js"); 
const flash =  require('connect-flash');
const session  = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require("passport");
const localStrategy = require('passport-local');
const User = require('./models/user.js');
// const mongoStore = require('passport-local-mongoose');

const dbUrl = process.env.ATLASDB_URL;

const listingsRouter = require('./routes/listing.js')
const reviewsRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

main().then(() => {
    console.log("connected to DB");
})
.catch((err) => {
    console.log(err); 
});

async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public"))); 


const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", (err) => {
    console.log("ERORR in MONGO SESSION STORE", err);
}); 

const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //for a week
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true, 
    }
}

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser()); //stores information of the user
passport.deserializeUser(User.deserializeUser()); //when the user ends the session we need to deserialized it

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
}); 

app.use((err, req, res, next) => {
    const {statusCode=500, message = " Something went wrong"} = err;
    res.status(statusCode).render("error.ejs", {err});
});

app.listen(port, () => {
    console.log("server is listening on port 3000");
});