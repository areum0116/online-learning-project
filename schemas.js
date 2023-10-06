const Joi = require('joi');

module.exports.boardSchema = Joi.object({
    board: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required().min(10)
    }).required()
});