const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas.js');
const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');

//! ----- CAMPGROUND ROUTING -----

// GET CAMPGROUNDS
router.get('/', CatchAsync(async (req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', { campgrounds })
}))

// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

// POST for new campground created above
router.post('/', isLoggedIn, validateCampground, CatchAsync(async (req, res, next) => {
    // more error handling than just form controls in case form bypassed
    // Joi validating data before we even save or make mongoose calls
    console.log(res);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully added new campground')
    res.redirect(`campgrounds/${campground._id}`);
}))

// VIEW SPECIFIC CAMPGROUND DETAILS
router.get('/:id', CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews').populate('author');
    console.log(campground);
    // redirect to index if campground does not exist
    if (!campground) {
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}));

// EDIT CAMPGROUND DETAILS
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Requested campground was not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

// EDIT logic, what happens when you press "Update Campground" button
router.put('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    // destruct request to pull id
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', 'Succesfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}))

// DELETE campground
router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'Campground deleted')
    res.redirect('/campgrounds');
}))

module.exports = router;