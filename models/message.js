var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageSchema = new Schema({
    fromSenderUserName: String,
    fromSenderUserID: String,
    contentOfMessage: String,
    messageTime: Date.now

});


module.exports = mongoose.model('Message', messageSchema);
