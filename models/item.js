var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
	name: String,
	isChecked: Boolean,
	responsibilityUserID: String
});





module.exports = mongoose.model('Item', itemSchema);
