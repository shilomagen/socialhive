var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var eventItems Scheme = new Schema({
    amountOfItems: { type:Number },
    itemsList: [item] // items array
});


module.exports = mongoose.model('EventItems', UserSchema);
