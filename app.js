const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const methodOverride = require('method-override');

//? MODEL REQS
const Campground = require('./models/campground');
const Review = require('./models/review');

//? ROUTER REQS
const campgroundRoutes = require('./routes/campgrounds.js');


// USE 127.0.0.1 INSTEAD OF LOCALHOST
mongoose.connect('mongodb://127.0.0.1:27017/yelpCampDb', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("Error, MONGO CONNECTION!!!!")
        console.log(err)
    })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => {
    console.log("DB Connected");
})

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// allows express to parse request bodies into values
app.use(express.urlencoded({ extended: true }))
// use method override
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        // map iterates through each item in array and applies condition to them
        // join separates them by commaw
        const msg = error.details.map(i => i.message).join(', ')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        // map iterates through each item in array and applies condition to them
        // join separates them by commaw
        const msg = error.details.map(i => i.message).join(', ')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// HOME PAGE
app.get('/', (req, res) => {
    res.render('home')
})



//! ----- REVIEW ROUTING -----
app.post('/campgrounds/:id/reviews', validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.delete('/campgrounds/:id/reviews/:reviewId', CatchAsync(async (req, res) => {
    // idk how it knows to pull
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
}))


app.all('*', (req, res, next) => {
    next(new ExpressError('Page not found', 404));
})

// BASIC ERROR HANDLER
app.use((err, req, res, next) => {
    const { statusCode = 500, message = 'something went wrong' } = err;
    if (!err.message) {
        err.message = "Oopsie! Error :("
    }
    res.status(statusCode).render('error', { err });
})

