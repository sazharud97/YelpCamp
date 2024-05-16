const express = require('express');
// merging paramas from app.js
const router = express.Router({ mergeParams: true });
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');

//? model reqs
const Campground = require('../models/campground');
const Review = require('../models/review');

//? Schema
const { reviewSchema } = require('../schemas.js')

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

//! ----- REVIEW ROUTING -----
router.post('/', validateReview, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', CatchAsync(async (req, res) => {
    // idk how it knows to pull
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;