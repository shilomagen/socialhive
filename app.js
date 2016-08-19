/**
 * Created by i327364 on 18/08/2016.
 */
var express = require('express');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var mongoose = require('mongoose');
var morgan = require('morgan');
var jwt = require('jwt-simple');
var port = process.env.PORT || 3333;

mongoose.connect('mongodb://localhost/socialhive', function() {
	console.log("DB connected successfully");
});
var apiRouter = require("./router");

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

app.use('/api', apiRouter);

var User = require("./models/user");

app.listen(port);
console.log("Server listening on port " + port);