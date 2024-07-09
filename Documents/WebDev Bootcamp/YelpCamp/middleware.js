const { campgroundSchema, reviewSchema } = require('./schemas.js');
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');

// checks to see if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    console.log('REQ.USER...', req.user);
    if (!req.isAuthenticated()) {
        // store url user tried to access
        // redirect there after log in
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in to continue');
        return res.redirect('/login');
    }
    next();
}

// passport now clears returnTo session var on login
//storing it as a local to use for redirect
module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampground = (req, res, next) => {
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

// validating that logged in user is author of campground they're trying to modify
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground.author.equals(req.user._id)) {
        req.flash('error', 'You no permission mista');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// validating that logged in user is author of review they're trying to modify
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author._id == req.user._id) {
        req.flash('error', 'You no permission mista');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}


module.exports.validateReview = (req, res, next) => {
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
