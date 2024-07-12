const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const Campgrounds = require('../controllers/campgrounds');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const { storage } = require('../cloudinary')
const upload = multer({ storage });
const Campground = require('../models/campground');

//! ----- CAMPGROUND ROUTING -----

//todo Express way of grouping routes of similar path
router.route('/')
    // GET CAMPGROUNDS
    .get(CatchAsync(Campgrounds.index))
    // POST for new campground created above
    .post(isLoggedIn, validateCampground, upload.array('image'), CatchAsync(Campgrounds.createCampground))


// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
router.get('/new', isLoggedIn, Campgrounds.renderNewForm)

router.route('/:id')
    // VIEW SPECIFIC CAMPGROUND DETAILS
    .get(CatchAsync(Campgrounds.showCampground))
    // EDIT logic, what happens when you press "Update Campground" button
    .put(isLoggedIn, isAuthor, CatchAsync(Campgrounds.updateCampground))
    // DELETE campground
    .delete(isLoggedIn, isAuthor, CatchAsync(Campgrounds.deleteCampground))


// EDIT CAMPGROUND DETAILS
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(Campgrounds.renderEditForm));



module.exports = router;