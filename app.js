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

mongoose.connect('mongodb://localhost/socialhive', function() {
	console.log("DB connected successfully");
});

var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

var User = require("./models/user");

app.post('/createUser', function(req, res){
	var userToInsert = new User();
	console.log(req.body.name + " " + req.body.username + " " + req.body.password);
	userToInsert.name = req.body.name;
	userToInsert.username = req.body.username;
	userToInsert.password = req.body.password;

	userToInsert.save(function(err){
		if (err){

			res.send(err);

		} else {
			res.send(userToInsert.name + " Was created successfully on DB");
		}
	})
});


app.listen(port);
console.log("Server listening on port " + port);