const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const campground = require('../models/campground');

//! ----- CAMPGROUND ROUTING -----

// GET CAMPGROUNDS
router.get('/', CatchAsync(campgrounds.index));

// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

// POST for new campground created above
router.post('/', isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampground))

// VIEW SPECIFIC CAMPGROUND DETAILS
router.get('/:id', CatchAsync(campgrounds.showCampground));

// EDIT CAMPGROUND DETAILS
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm));

// EDIT logic, what happens when you press "Update Campground" button
router.put('/:id', isLoggedIn, isAuthor, CatchAsync(campgrounds.updateCampground));

// DELETE campground
router.delete('/:id', isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground))

module.exports = router;