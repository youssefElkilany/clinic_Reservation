const joi = require('joi');

const dataMethods = ["body", 'params', 'query', 'headers', 'file']

const roles = {
    patient:"patient",
    doctor:"doctor"}

Object.freeze(roles)




const generalFields = {

    email: joi.string().email({
        minDomainSegments: 2,
        maxDomainSegments: 4,
        tlds: { allow: ['com', 'net'] }
    }).required(),
    password: joi.string(),
    cPassword: joi.string().required(),
   // id: joi.string().custom(validateObjectId),
    name: joi.string().required(),
    // file: joi.object({
    //     size: joi.number().positive().required(),
    //     path: joi.string().required(),
    //     filename: joi.string().required(),
    //     destination: joi.string().required(),
    //     mimetype: joi.string().required(),
    //     encoding: joi.string().required(),
    //     originalname: joi.string().required(),
    //     fieldname: joi.string().required()
    // })
}

 const validation = (schema) => {
    return (req, res, next) => {
        console.log({ body: req.body });
        const validationErr = []
        dataMethods.forEach(key => {
            if (schema[key]) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErr.push(validationResult.error.details)
                }
            }
        });

        if (validationErr.length) {
            return res.json({ message: "Validation Err", validationErr })
        }
        return next()
    }
}



module.exports ={ 
     roles,validation,generalFields
}