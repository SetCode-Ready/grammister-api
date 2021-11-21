const bcrypt = require('bcryptjs');
const { UserInputError } = require('apollo-server');

const User = require('../../models/User');
const { validateUserRegisterInput } = require('../../validators/validateUserRegisterInput');
const { validateUserLoginInput } = require('../../validators/validateUserLoginInput');
const { generateToken } = require('../../utils/generateToken');
const { authValidate } = require('../../utils/authValidate');

module.exports = {

    Query: {

        async findAllUsers() {
            try {
                const users = await User.find();
                return users;
            } catch (err) {
                throw new Error(err);
            }
        },

        async findUserById(_, { userId }) {
			try {
				const user = await User.findById(userId);
				
				if (!user) {
					throw new Error('User not found');
				}

				return user;
			} catch (err) {
				throw new Error(err);
			}
		},

        async findUsersByName(_, { userName }) {
			try {
				const users = await User.find();

                const usersFiltered = users.filter(user => user.name.includes(userName));

				return usersFiltered;
			} catch (err) {
				throw new Error(err);
			}
		},

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
        },

        async followUser(_, { userId }, context) {
            const user = authValidate(context);

            if (userId.trim() === '') {
				throw new Error('UserId must not be empty');
			}

            const currentUser = await User.findById(user.id)
            const userToFollow = await User.findById(userId);

            if (user.id === userId) {
                throw new Error("You can't follow yourself!");
            }

            try {
                if (!currentUser.following?.includes(userToFollow.id)) {
                    await currentUser.updateOne({ $push: { following: userToFollow.id } });
                    await userToFollow.updateOne({ $push: { followers: currentUser.id } });
                    return "You are following the user!";
                } else {
                    await currentUser.updateOne({ $pull: { following: userToFollow.id } });
                    await userToFollow.updateOne({ $pull: { followers: currentUser.id } });
                    return "You unfollowed the user."
                }
            } catch (err) {
                throw new Error(err.message);
            }
        }
    }
};