const jwt = require('jsonwebtoken');

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        email: user.email,
        username: user.name,
    }, process.env.SECRET_KEY, { expiresIn: '1d'});
}

module.exports = { generateToken };