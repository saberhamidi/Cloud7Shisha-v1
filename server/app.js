const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const database = require('./config/database');
const users = require('./routes/users');
const basket = require('./routes/basket');
const address = require('./routes/address');
const order = require('./routes/order');

mongoose.Promise = global.Promise;
mongoose.connect(database.database);
mongoose.connection.on('connected', function(){

	console.log("connected to database " +database.database);
});

//if connection fails
mongoose.connection.on('error', function(err){

	console.log("Database error " +err);
});

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());

//set static folder
app.use(express.static(path.join(__dirname, "client")));

//Body parser middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);
app.use('/basket', basket);
app.use('/address', address);
app.use('/order', order);

//index route
app.get('/', function(req, res){
	res.send("Invalid endpoint");
});

app.listen(port, function(){

	console.log("the server started on port "+port);
});