const Joi = require("joi");
const review = require("./models/review");

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        // title required
        title: Joi.string().required(),
        //price required w/ min of $0
        price: Joi.number().required().min(1),
        //image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required(),
    deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
});