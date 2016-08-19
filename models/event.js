var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventScheme = new Schema({
	eventName: String,
  numberOfParticipants: { type: Number },
  organizerID: String,
  eventStatusCode: { type: Number },
  eventTypeCode: { type: Number },
  premiumAccout: Boolean,
  eventLocation: String
  eventStartDate: { type: Date, default: Date.now }
  eventEndDate: { type: Date, default: Date.now }
	eventItemList: { type: eventItems }
	eventMessagesFeed: { type: MessagesFeed }
});


module.exports = mongoose.model('Event', UserSchema);
