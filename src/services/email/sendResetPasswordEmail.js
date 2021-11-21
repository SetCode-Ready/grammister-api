const crypto = require('crypto');

const User = require('../../models/User');
const EmailToken = require('../../models/EmailToken');
const sendEmail = require('./emailService');

const sendResetPasswordEmail = async (request, response) => {

    const userEmail = request.body.email;

    const user = await User.findOne({ email: userEmail});

    if (user) {
        const userId = user._id;
        const subject = "Reset password instructions";
        
        let token = await EmailToken.findOne({ userId });
        if (!token) {
            token = await new EmailToken({
                userId,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const body = `To reset your password, please click on this link: http://localhost:3000/reset-password/${userId}/${token.token}`;

        sendEmail(userEmail, subject, body);

        return response.status(200).json("Email send succesfully!");
    } else {
        return response.status(400).json("User not found.");
    }
}

module.exports = sendResetPasswordEmail;