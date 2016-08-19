var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var itemSchema = new Schema({
	itemName: String,
	checked: Boolean,
	responsibilityUserID: String
});


module.exports = mongoose.model('Item', itemSchema);
