var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var itemSchema = new Schema({
	name: String,
	isChecked: {type: Boolean, default: false},
	responsibilityUserID: {type: String, default: null}
});


module.exports = mongoose.model('Item', itemSchema);
