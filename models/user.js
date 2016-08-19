/**
 * Created by i327364 on 19/08/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	firstName: String,
	lastName: String,
	emailAddress: String,
	password: {
		type: String,
		required: true,
		select: false
	},
	createdAtDate: {type: Date, default: Date.now},
	profilePicturePath: String,//User ID_pic.jpg on images folder
	userAddressStreet: String,
	userAddressCity: String,
	userAddressRegion: String,
	userAddressCountry: String,
	userAge: {type: Number}
	//eventsCreated: [event],
	//eventsParticipate: [event],
	//messages: [message]
});


module.exports = mongoose.model('User', UserSchema);
