const express = require('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const CatchAsync = require('./utils/CatchAsync');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas.js')
const methodOverride = require('method-override');

const Campground = require('./models/campground');
const Review = require('./models/review');

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

// GET CAMPGROUNDS
app.get('/campgrounds', CatchAsync(async (req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', { campgrounds })
}))

// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// POST for new campground created above
app.post('/campgrounds', validateCampground, CatchAsync(async (req, res, next) => {
    // more error handling than just form controls in case form bypassed
    // Joi validating data before we even save or make mongoose calls
    console.log(result);
    const campground = new Campground(req.body.campground);
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
}))

// VIEW SPECIFIC CAMPGROUND DETAILS
app.get('/campgrounds/:id', CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// EDIT CAMPGROUND DETAILS
app.get('/campgrounds/:id/edit', CatchAsync(async (req, res) => {
    const campground = await (Campground.findById(req.params.id));
    res.render('campgrounds/edit', { campground });
}))

app.listen(3000, () => {
    console.log('LISTENING ON PORT 3000 SAH!!!')
})

// EDIT logic, what happends when you press "Update Campground" button
app.put('/campgrounds/:id', CatchAsync(async (req, res) => {
    // destruct request to pull id
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

// DELETE campground
app.delete('/campgrounds/:id', CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

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
    res.send('DELETED :( so mean uwu');
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

