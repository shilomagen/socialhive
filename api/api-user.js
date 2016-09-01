/**
 * Created by i327364 on 21/08/2016.
 */
var express = require('express');
var User = require('./../models/user');
var jwt = require('jsonwebtoken');

var userRouter = express.Router();

userRouter.use(function(req, res, next) {
	//TODO: check if user authenticated, by JWT
	/*
	 is user not authenticated, redirect to homepage

	 */
	if ((req.url === "/login") || (req.url === '/register') || (req.url === '/logout')) {
		next();
	}

	else if (req.cookies.jwtToken) {
		console.log(req.cookies);
		jwt.verify(req.cookies.jwtToken, "TEMP_SECRET", function(err, decoder) {
				if (err) {
					res.send({
						success: false,
						msg: "not authenticated"
					});
					//TODO: redirect to login page
				} else {
					res.send({
						success: true,
						msg: decoder
					});
				}
				next();
			}
		);

	} else {
		res.status(503).send({
			success: false,
			msg: "please log in"
		});
	}

});

userRouter.route('/register')
	.post(function(req, res) {
		var user = new User();
		user.firstName = req.body.fname;
		user.lastname = req.body.lname;
		user.email = req.body.email;
		user.setPassword(req.body.password);
		user.save(function(err) {
			console.log(user);
			if (err) {
				res.json({
					success: false,
					msg: err
				});
			} else {
				console.log("User " + user.firstName + " was created");
				res.send({
					success: true,
					msg: "user " + user.email + " was created!"
				});
			}
		});
	});

userRouter.route('/login')
	.post(function(req, res) {
		var email = req.body.email;
		var password = req.body.password;
		User.findOne({
			'email': {
				$eq: email
			}
		}, function(err, user) {
			if (err) {
				res.status(500).send({
					success: false,
					msg: "cant find email like yours"
				});
			} else {
				var isRightPassword = user.validPassword(password);
				if (isRightPassword) {
					console.log(email + " is logged in!");
					var token = user.generateJwt();
					res.cookie('jwtToken', token, {maxAge: 900000, httpOnly: true});
					res.send({
						success: true,
						msg: "user logged in"
					});
				} else {
					res.status(500).send({
						success: false,
						msg: "password wrong"
					});
				}
			}
		})

	});

userRouter.route('/logout')
	.get(function(req, res) {
		res.clearCookie('jwtToken');
		res.send({
			success: true,
			msg: "disconnected"
		})
	});

module.exports = userRouter;


