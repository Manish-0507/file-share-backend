require('dotenv').config();
const mongoose = require('mongoose');
function connectDB() {
	// Database connection
	mongoose.connect(process.env.MONGO_CONNECTION_URL, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useUnifiedTopology: true,
		useFindAndModify: true
	});
	const connection = mongoose.connection;
	connection.once('open', () => {
		console.log('Database connected');
	});
	connection.on('error', () => {
		console.log('error connecting db');
	});
}

module.exports = connectDB;
