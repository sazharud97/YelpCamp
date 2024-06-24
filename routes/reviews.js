const express = require('express');
// merging paramas from app.js
const router = express.Router({ mergeParams: true });
const CatchAsync = require('../utils/CatchAsync');

//? model reqs
const Campground = require('../models/campground');
const Review = require('../models/review');

//? Schema
const { isLoggedIn, validateReview } = require('../middleware.js');


//! ----- REVIEW ROUTING -----
router.post('/', validateReview, isLoggedIn, CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Your review was posted')
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', CatchAsync(async (req, res) => {
    // idk how it knows to pull
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('deleted', 'Review deleted')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;