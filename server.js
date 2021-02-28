require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 8080;
const path = require('path');
 require('./config/db');


app.use(express.static('public'));
app.use(express.json());//if any json data is encountered then it will able to parse it

//template engine
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'ejs');

// Routes 
app.use('/api/files', require('./Routes/Files'));
app.use('/files', require('./Routes/show'));
app.use('/files/download', require('./Routes/download'));


app.listen(PORT, console.log(`Listening on port ${PORT}.`));































































































