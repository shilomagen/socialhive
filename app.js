/**
 * Created by i327364 on 18/08/2016.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var session = require('express-session');
var morgan = require('morgan');
var port = process.env.PORT || 3333;

require('./models/user');
require('./api/config/passport');
require('./api/config/dbconfig');

var eventRouter = require("./api/api-event");
var userRouter = require("./api/api-user");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(session({
	secret: "ShiloMangam",
	saveUninitialized: false,
	resave: true
}));
app.use(passport.initialize());




app.use('/api' ,eventRouter);
app.use('/user', userRouter);

app.use(express.static(__dirname + '/public'));
var User = require("./models/user");

app.listen(port);
console.log("Server listening on port " + port);