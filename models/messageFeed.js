var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messageFeedSchema = new Schema({
    messagesList: [message]

});


module.exports = mongoose.model('MessageFeed', messageFeedSchema);
