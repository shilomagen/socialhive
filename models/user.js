/**
 * Created by i327364 on 19/08/2016.
 */
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	firstName: String,
	lastName: String,
	email: {
		type:String,
		unique: true,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	createdAtDate: {type: Date, default: Date.now},
	profilePicturePath: String,//User ID_pic.jpg on images folder
	userAddressStreet: String,
	userAddressCity: String,
	userAddressRegion: String,
	userAddressCountry: String,
	userAge: {type: Number},
	eventInvited: [Schema.Types.ObjectId]
	//eventsCreated: [event],
	//eventsParticipate: [event],
	//messages: [message]
});

userSchema.methods.setPassword = function(password){
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


module.exports = mongoose.model('User', userSchema);
