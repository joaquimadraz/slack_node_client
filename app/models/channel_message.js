var mongoose = require('mongoose');

var ChannelMessageSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  text:   { type: String, required: true },
  ts:     { type: String, required: true }
});

module.exports = mongoose.model('ChannelMessage', ChannelMessageSchema);
