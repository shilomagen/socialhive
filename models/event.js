var mongoose = require('mongoose');
var Item = require('./../models/item');

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
eventSchema.methods.getParticipantsByIds = function(obj) {
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


module.exports = mongoose.model('Event', eventSchema);
