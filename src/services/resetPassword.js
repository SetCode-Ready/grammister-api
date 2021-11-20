const Joi = require('joi');
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const EmailToken = require('../models/EmailToken');

const resetPassword = async (request, response) => {
    try {
        const schema = Joi.object({ password: Joi.string().required() });
        const { error } = schema.validate(request.body);

        if (error) {
            return response.status(400).json(error.details[0].message);
        }

        const user = await User.findById(request.params.userId);

        if (!user) {
            return response.status(400).json("invalid link or expired");
        }

        const token = await EmailToken.findOne({
            userId: user._id,
            token: request.params.token,
        });

        if (!token) {
            return response.status(400).json("Invalid link or expired");
        }

        const hashedPassword = await bcrypt.hash(request.body.password, 12);

        user.password = hashedPassword;
        await user.save();
        await token.delete();

        response.status(200).json("Password reset sucessfully.");
    } catch (error) {
        response.status(500).json("An error occured on the server.");
    }
}

module.exports = resetPassword;