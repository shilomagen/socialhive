var mongoose = require('mongoose');
var Item = require('./../models/item');
var Q = require('q');
var extend = require('extend');
var consts = require('./../consts');

var Schema = mongoose.Schema;


var eventSchema = new Schema({
	name: String,
	numberOfParticipants: {type: Number},
	organizerID: String,
	statusCode: {type: Number},
	typeCode: {type: Number},
	premiumAccout: Boolean,
	location: String,
	startDate: {type: Date, default: Date.now},
	endDate: {type: Date, default: Date.now},
	participants: [
		{
			userID: Schema.Types.ObjectId,
			rsvp: String
		}
	],
	items: [Schema.Types.ObjectId]
});


eventSchema.methods.getItemsByIds = function(obj) {
	var items = this.items;
	Item.find({
		'_id': {
			$in: items
		}
	}, function(err, docs) {
		if (err && obj.error) {
			obj.error(err);
		} else {
			if (obj.success) {
				obj.success(docs);
			}
		}
	});
};

eventSchema.methods.addUserToEvent = function(user, res) {
	var deferred = Q.defer();
	var eventToAdd;
	this.participants.push({
		userID: user._id,
		rsvp: "INVITED"
	});
	this.save()
		.then((event)=> {
			eventToAdd = event;
			console.log(user.email + " was added to event '" + event.name + "' successfully");
			user.eventInvited.push(event._id);
			return user.save();
		})
		.then((user) => {
			console.log("Event '" + eventToAdd.name + "' was added to " + user.email + " successfully");
			res.send({success: true, msg: user.email + " was added to event: " + eventToAdd.name + " successfully"});
			deferred.resolve(user);
		})
		.catch(deferred.reject);
	return deferred.promise;
};

eventSchema.methods.getParticipantsByIds = function(obj) {
	var deferred = Q.defer();

	var users = this.participants.map(function(user) {
		return user.userID;
	});
	obj.userSchema.find({
		'_id': {
			'$in': users
		}
	}, function(err, users) {
		if (err && obj.error) {
			obj.error(err);
		} else {
			if (obj.success) {
				obj.success(users);
			}
		}
	});
};
eventSchema.statics.createNewEvent = function(eventInfo) {
	var deferred = Q.defer();
	var event = new Event();
	extend(event, eventInfo);
	event.save(function(err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(event);
		}
	});
	return deferred.promise;
};


var Event = mongoose.model('Event', eventSchema);
module.exports = Event;
