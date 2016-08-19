var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var item Scheme = new Schema({
    itemName: String,
    checked: Boolean,
    responsibilityUserID: String
});


module.exports = mongoose.model('Item', UserSchema);
