var mongoose = require('mongoose');
var Item = require('./../models/item');
var Schema = mongoose.Schema;


//TODO: add participants -> user with rsvp
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
			name: String,
			rsvp: String
		}
	],
	items: [Schema.Types.ObjectId]

	//eventItemList: {type: eventItems},
	//eventMessagesFeed: {type: MessagesFeed}
});

eventSchema.methods.getByIds = function(obj) {

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


module.exports = mongoose.model('Event', eventSchema);
