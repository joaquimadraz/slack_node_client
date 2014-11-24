var Core = require('../core');
var config = require('./config');
var mongoose = require('mongoose');

module.exports = setup;

function setup(cb) {
  var core = Core(config);

  cleanUp(core.db, function(err){
    cb(core);
  });
}

function cleanUp(database, cb){
  var collections = mongoose.connection.collections;
  var todo = Object.keys(collections).length;

  if (todo == 0) return cb();

  for (var key in collections) {
    var collection = collections[key];

    if (collection.name.match(/^system\./))
      return --todo;

    collection.remove({ },{ safe: true }, function() {
      if (--todo === 0) cb();
    });
  }
}
