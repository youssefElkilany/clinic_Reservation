const joi = require('joi');
const  { generalFields } = require ('../../middelware/validation.js')

const signup = {
    body: joi.object().required().keys({
        name:generalFields.name,
        email:joi.string().email({minDomainSegments:2,maxDomainSegments:4,tlds:{allow:['eg','edu','com']}}).required(),
        password:generalFields.password,
        cpassword:joi.string().valid(joi.ref("password")).required(),
        role:joi.any().valid("patient", "doctor"),
        phone:joi.string().min(11).max(11).required()
    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

const login = {
    body: joi.object().required().keys({
        email:joi.string().email({minDomainSegments:2,maxDomainSegments:4,tlds:{allow:['eg','edu','com']}}).required(),
        password:generalFields.password,
        role:joi.any().valid("patient", "doctor").required()

    }),
    params: joi.object().required().keys({}),
    query: joi.object().required().keys({})
}

module.exports = {signup,login}

// module.exports = router