/**
 * Created by i327364 on 21/08/2016.
 */
var express = require('express');
var User = require('./../models/user');

var userRouter = express.Router();
userRouter.use(function(req, res, next){
	next();

});

userRouter.use('/', function(req, res){
	res.send(req.session);
});

userRouter.route('/user/createUser')
	.post(function(req, res) {
		var user = new User();
		user.firstName = req.body.firstName;
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
				var token;
				token = user.generateJwt();
				res.status(200);
				res.json({
					"token": token
				});
			}

		});

	});


module.exports = userRouter;


