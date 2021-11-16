const { model, Schema } = require('mongoose');

const userSchema = new Schema({
  name: String,
  email: String,
  birthDate: String,
  password: String,
  gender: String,
  followers: {
    type: Array,
    default: []
  },
  following: {
    type: Array,
    default: []
  },
  createdAt: String,
  updatedAt: String,
  avatar: String,
});

module.exports = model('User', userSchema);