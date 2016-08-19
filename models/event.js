var mongoose = require('mongoose');
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
	endDate: {type: Date, default: Date.now}
	//eventItemList: {type: eventItems},
	//eventMessagesFeed: {type: MessagesFeed}
});


module.exports = mongoose.model('Event', eventSchema);
