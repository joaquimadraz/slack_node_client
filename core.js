var fs = require('fs');
var path = require('path');
var xtend = require('util')._extend;
var assert = require('assert');
var mongoose = require('mongoose');

module.exports = Core;

function Core(opts) {
  loadModels();

  var database = startMongoose(opts);
  var usecases = loadUsecases();
  var models = database.models;

  var internals = {
    db: database
  };

  var app = {};

  app = xtend(app, usecases);
  app = xtend(app, models);
  app = xtend(app, internals);

  return app;
}

function loadUsecases() {
  var usecasesDir = path.join(__dirname, "/app/usecases");

  return fs.readdirSync(usecasesDir).reduce(function(acc, dir) {
    var usecase =  require(path.join(usecasesDir, dir));
    acc[dir]    =  usecase;
    return acc;
  }, { });
}

function startMongoose(opts, cb) {
  assert(opts.database, 'need database to initialize');

  var uri = opts.database.uri;
  var options = opts.database.options;

  mongoose.connect(uri, options, function(err) {
    if(err) throw err;
  });

  return mongoose;
}

function loadModels() {
  var modelsDir = path.join(__dirname, "/app/models");

  fs.readdirSync(modelsDir).forEach(function(model) {
    if(model.match(/\.js$/)) require(path.join(modelsDir, model));
  });
}
