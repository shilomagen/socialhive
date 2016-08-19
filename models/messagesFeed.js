var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var messagesFeedScheme = new Schema({
    messagesList: [message]

});


module.exports = mongoose.model('MessagesFeed', UserSchema);
