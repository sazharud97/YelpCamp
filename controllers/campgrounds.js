const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}