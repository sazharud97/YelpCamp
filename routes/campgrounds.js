const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');

//! ----- CAMPGROUND ROUTING -----

const validateCampground = (req, res, next) => {
    const { error } = chema.validate(req.body);
    if (error) {
        // map iterates through each item in array and applies condition to them
        // join separates them by commaw
        const msg = error.details.map(i => i.message).join(', ')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// GET CAMPGROUNDS
router.get('/campgrounds', CatchAsync(async (req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', { campgrounds })
}))

// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
router.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
})

// POST for new campground created above
router.post('/campgrounds', validateCampground, CatchAsync(async (req, res, next) => {
    // more error handling than just form controls in case form bypassed
    // Joi validating data before we even save or make mongoose calls
    console.log(res);
    const campground = new Campground(req.body.campground);
    await campground.save();

    res.redirect(`/campgrounds/${campground._id}`);
}))

// VIEW SPECIFIC CAMPGROUND DETAILS
router.get('/campgrounds/:id', CatchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}));

// EDIT CAMPGROUND DETAILS
router.get('/campgrounds/:id/edit', CatchAsync(async (req, res) => {
    const campground = await (Campground.findById(req.params.id));
    res.render('campgrounds/edit', { campground });
}))

// EDIT logic, what happens when you press "Update Campground" button
router.put('/campgrounds/:id', CatchAsync(async (req, res) => {
    // destruct request to pull id
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${campground._id}`)
}))

// DELETE campground
router.delete('/campgrounds/:id', CatchAsync(async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

module.exports = router;