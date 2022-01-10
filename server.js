require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');

const connectDB = require('./config/db');
connectDB();

app.use(express.static('public'));
app.use(express.json()); //if any json data is encountered then it will able to parse it

//template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

//Add Access Control Allow Origin Headers
app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
	next();
});

// Routes
app.use('/api/files', require('./Routes/Files'));
app.use('/files', require('./Routes/show'));
app.use('/files/download', require('./Routes/download'));

app.listen(PORT, console.log(`Listening on port ${PORT}.`));
