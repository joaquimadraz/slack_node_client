var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
  userId:   { type: String, required: true, index: { unique: true } },
  username: { type: String, required: true }
});

module.exports = mongoose.model('User', UserSchema);
