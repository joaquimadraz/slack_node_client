var mongoose = require('mongoose');
var ChannelMessage = require('./channel_message').findOrCreate;

var ChannelHistorySchema = new mongoose.Schema({
  channelId: { type: String, required: true },
  messages:  { type: [ChannelMessage] },
  lastTs:    { type: String },
  name:      { type: String, required: true }
});

module.exports = mongoose.model('ChannelHistory', ChannelHistorySchema);
