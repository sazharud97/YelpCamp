const Joi = require("joi");

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        // title required
        title: Joi.string().required(),
        //price required w/ min of $0
        price: Joi.number().required().min(1),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})