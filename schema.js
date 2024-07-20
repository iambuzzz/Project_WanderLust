const Joi = require('joi');

// Listing schema
const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.object({
            filename: Joi.string(),
            url: Joi.string(),
        }),   
        owner: Joi.string(),
        geometry: Joi.object({
            type: Joi.string().valid('Point').required(),
            coordinates: Joi.array().items(Joi.number()).required(),
        }),
        category: Joi.string().valid("FarmHouse","Resort", "Villa","WaterVilla", "Beach", "Mountain", "TreeHouse", "Arctic", "Camping", "Castle", "Island", "Mansion", "Dome", "TinyHome", "BoatHouse", "Others"),
     }).required(),
});

// Review schema
const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required(),
    }).required(),
});

module.exports = {
    listingSchema,
    reviewSchema
};
