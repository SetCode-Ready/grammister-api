const Joi = require("joi");
const { validationErrorBuilder } = require("./validationErrorBuilder");

const validateUserRegisterInput = (
    name, 
    email,
    password, 
    birthDate, 
    gender,
) => {
    const schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().message("Please, insert a valid email."),
        password: Joi.string().min(6).message("The password must be at least 6 characters."),
        birthDate: Joi.string().isoDate().required(),
        gender: Joi.string().required(),
    });

    const result = schema.validate({
        name,
        email,
        password,
        birthDate,
        gender,
    }, { abortEarly: false });

    return validationErrorBuilder(result);
}

module.exports = { validateUserRegisterInput };