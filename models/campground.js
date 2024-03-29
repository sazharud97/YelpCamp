const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: String,
    description: String,
    location: String
})

// exporting model
module.exports = mongoose.model('Campground', CampgroundSchema);