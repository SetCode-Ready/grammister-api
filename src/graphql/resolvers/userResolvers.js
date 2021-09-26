const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { validateUserRegisterInput } = require('../../validators/validateUserRegisterInput');
const { validateUserLoginInput } = require('../../validators/validateUserLoginInput');
const { generateToken } = require('../../utils/generateToken');

module.exports = {

    Query: {

        async findAllUsers() {
            try {
                const users = await User.find();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        }

    },

    Mutation: {
        async login(_, { email, password }) {
            const { errors, valid } = validateUserLoginInput(email, password);

            if (!valid) {
                throw new UserInputError('Errors on inputs', { errors });
            }
            
            const user = await User.findOne({ email });
    
            if (!user) {
                throw new UserInputError('User not found');
            }
    
            const match = await bcrypt.compare(password, user.password);
    
            if (!match) {
                throw new UserInputError('Passwords do not match', { errors });
            }
    
            const token = generateToken(user);
    
            return {
                ...user.doc,
                id: user._id,
                token
            };
        },

        async register(_, { registerInput: { name, email, password, birthDate, gender, } }) {
            const { valid, errors } = validateUserRegisterInput(
                name,
                email,
                password,
                birthDate,
                gender,
            );

            if (!valid) {
                throw new UserInputError('Error on inputs', { errors });
            }
    
            const existingUser = await User.findOne({ email });
    
            if (existingUser) {
                throw new UserInputError('Email already used', {
                    errors: {
                        email: "This email is already taken"
                    }
                });
            }
    
            const hashedPassword = await bcrypt.hash(password, 12);
    
            const newUser = new User({
                name,
                email,
                password: hashedPassword,
                birthDate,
                gender,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            });
    
            const response = await newUser.save();
    
            const token = generateToken(response);
    
            return {
                ...response._doc,
                id: response._id,
                token,
            };
        }
    }
};