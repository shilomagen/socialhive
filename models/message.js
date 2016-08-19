var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageScheme = new Schema({
    fromSenderUserName: String,
    fromSenderUserID: String,
    contentOfMessage: String,
    timeOfMessage: { Date.now }

});


module.exports = mongoose.model('Message', UserSchema);
