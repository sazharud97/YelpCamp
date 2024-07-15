const Campground = require('../models/campground');

module.exports.index = async (req, res) => {
    const campgrounds = await (Campground.find({}));
    res.render('campgrounds/index', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    // more error handling than just form controls in case form bypassed
    // Joi validating data before we even save or make mongoose calls
    console.log(res);
    const campground = new Campground(req.body.campground);
    // mapping every uploaded file into an array of "campground.image"s
    // pulling image properties from multer request data
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }))
    campground.author = req.user._id;
    await campground.save();
    console.log(campground);
    req.flash('success', 'Successfully added new campground')
    res.redirect(`campgrounds/${campground._id}`);
}

module.exports.showCampground = async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        // nested populate, reviews and then review authors
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(campground);
    // redirect to index if campground does not exist
    if (!campground) {
        req.flash('error', 'Campground does not exist');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}

// EDIT CAMPGROUND DETAILS
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Requested campground was not found');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res) => {
    // destruct request to pull id
    const { id } = req.params;
    console.log(req.body);
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    // mapping every uploaded file into an array of "campground.image"s
    // pulling image properties from multer request data
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...imgs);
    await campground.save();
    if (req.body.deleteImages) {
        // pulls any image that was added to our deleteImages[] array
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } })
        console.log(campground);
    }
    req.flash('success', 'Succesfully updated campground')
    res.redirect(`/campgrounds/${campground._id}`)
}

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('deleted', 'Campground deleted')
    res.redirect('/campgrounds');
}
