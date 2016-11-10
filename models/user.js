/**
 * Created by i327364 on 19/08/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var Event = require('./../models/event');
var Q = require('q');
var Schema = mongoose.Schema;


var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type: String,
		unique: true,
		required: true,
		index: true
	},
	eventCreated: [Schema.Types.ObjectId],
	password: {
		type: String,
		required: true
	},
	createdAtDate: {type: Date, default: Date.now},
	profilePicturePath: String,
	userAddressStreet: String,
	userAddressCity: String,
	userAddressRegion: String,
	userAddressCountry: String,
	userAge: {type: Number},
	eventInvited: [Schema.Types.ObjectId]
});


userSchema.methods.setPassword = function(password) {
	var user = this;
	bcrypt.hash(password, null, null, function(err, hash) {
		if (err)
			return next(err);
		user.password = hash;
	});
};
userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};
userSchema.methods.generateJwt = function() {
	var expiry = new Date();
	expiry.setDate(expiry.getDate() + 7);

	return jwt.sign({
		_id: this._id,
		email: this.email,
		exp: parseInt(expiry.getTime() / 1000)
	}, "TEMP_SECRET"); //TODO: set the secret on the machine
};
userSchema.methods.getEvents = function(obj) {
	var events = obj.isCreated ? this.eventCreated : this.eventInvited;
	Event.find({
		'_id': {
			$in: events
		}
	}, function(err, events) {
		if (err && obj.error) {
			obj.error(err);
		} else {
			if (obj.success) {
				obj.success(events);
			}
		}
	});
};

userSchema.statics.updateUserEventCreated = function(event) {
	var deferred = Q.defer();
	var userID = event.organizerID;
	User.findById(userID, function(err, user) {
		if (err) {
			deferred.reject(err);
		} else {
			user.eventCreated.push(event._id);
			user.save(function(err) {
				if (err) {
					deferred.reject(err);
				} else {
					console.log("Event " + event.name + " was added to " + user.email);
					deferred.resolve(event);
				}
			});
		}
	});
	return deferred.promise;
};
userSchema.statics.handleNonRegisteredUser = function(email){
	//TODO: when user not registered, what to do?
	return true;
};
var User = mongoose.model('User', userSchema);
module.exports = User;
