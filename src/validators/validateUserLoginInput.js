const Joi = require('joi');
const { validationErrorBuilder } = require('./validationErrorBuilder');

const validateUserLoginInput = (email, password) => {
    const schema = Joi.object({
        email: Joi.string().email().message("Please, insert a valid email."),
        password: Joi.string().min(6).message("The password must be at least 6 characters."),
    });

    const result = schema.validate({email, password}, { abortEarly: false });

    return validationErrorBuilder(result);
}

module.exports = { validateUserLoginInput };