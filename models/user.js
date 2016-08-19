/**
 * Created by i327364 on 19/08/2016.
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
	name: String,
	username: String,
	password: {type: String}
});


module.exports = mongoose.model('User', UserSchema);