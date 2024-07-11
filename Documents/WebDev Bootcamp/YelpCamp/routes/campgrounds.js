const express = require('express');
const router = express.Router();
const CatchAsync = require('../utils/CatchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds');

const { isLoggedIn, isAuthor, validateCampground } = require('../middleware.js');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const campground = require('../models/campground');

//! ----- CAMPGROUND ROUTING -----

//todo Express way of grouping routes of similar path
router.route('/')
    // GET CAMPGROUNDS
    .get(CatchAsync(campgrounds.index))
    // POST for new campground created above
    // .post(isLoggedIn, validateCampground, CatchAsync(campgrounds.createCampground))
    // using multer to upload images and store them in upload folder
    .post(upload.array('image'), (req, res) => {
        console.log(req.body, req.files);
    })

// NEW CAMPGROUND PAGE
// needs to be ABOVE show page else logic will look for campground with ID "new"
router.get('/new', isLoggedIn, campgrounds.renderNewForm)

router.route('/:id')
    // VIEW SPECIFIC CAMPGROUND DETAILS
    .get(CatchAsync(campgrounds.showCampground))
    // EDIT logic, what happens when you press "Update Campground" button
    .put(isLoggedIn, isAuthor, CatchAsync(campgrounds.updateCampground))
    // DELETE campground
    .delete(isLoggedIn, isAuthor, CatchAsync(campgrounds.deleteCampground))


// EDIT CAMPGROUND DETAILS
router.get('/:id/edit', isLoggedIn, isAuthor, CatchAsync(campgrounds.renderEditForm));



module.exports = router;