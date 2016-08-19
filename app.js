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
var port = process.env.PORT || 3000;



var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

var obj = {
	shilo:"hello",
	age:27
};

app.get('/events/:id', function(req,res){
	res.send(obj);
});

app.listen(port);
console.log("Server listening on port "+ port);