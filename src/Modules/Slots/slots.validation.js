const joi = require('joi');
const  { generalFields } = require ('../../middelware/validation.js')

 const addSlots = {
    body: joi.object().required().keys({
        date: joi.date().required()
        // hours:joi.number().integer().min(1).max(12).required(),
       
    }).unknown(),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({
        Authorization: joi.string().required()
    })
}

module.exports = {addSlots}