const { ref } = require('joi');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

// creates thumbnail property for img schema
// creating thumbnail b limiting width
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})

const CampgroundSchema = new Schema({
    title: String,
    images: [ImageSchema],
    price: String,
    description: String,
    location: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

// After validation(post)
// this runs on the 'findOneAndDelete' calls
// deletes all reviews associated with deleted campground
CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if (doc) {
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

// exporting model
module.exports = mongoose.model('Campground', CampgroundSchema);