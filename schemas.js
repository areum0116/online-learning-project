const Joi = require('joi');

module.exports.boardSchema = Joi.object({
    board: Joi.object({
        title: Joi.string().required(),
        text: Joi.string().required()
    }).required()
});

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required()
    }).required()
});