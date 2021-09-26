const mongoose = require('mongoose');

module.exports = () => {
	mongoose.connect(process.env.MONGO_URL, () => {
		console.log('MongoDB connected');
	}); 
};
