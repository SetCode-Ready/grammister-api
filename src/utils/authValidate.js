const { AuthenticationError } = require('apollo-server-errors');
const jwt = require('jsonwebtoken');

const authValidate = (context) => {
    const authHeader = context.req.headers.authorization;

    if (!authHeader) {
        throw new Error('Authorization header must be provided');
    }

    const token = authHeader.split('Bearer')[1].trim();

    if (!token) {
        throw new Error('Authentication must be \'Bearer [token]\'');
    }

    try {
        const user = jwt.verify(token, process.env.SECRET_KEY);

        return user;
    } catch (err) {
        throw new AuthenticationError('Invalid or expired token');
    }
};

module.exports = { authValidate };