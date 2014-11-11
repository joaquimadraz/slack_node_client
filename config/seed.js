var SlackCli = require('../slack_cli');
var config = require('./config');
var Core = require('../core');

var core = Core(config);

// seed users
core.users.getAndCreate(function(dbUsers){
  console.log('Users on DB', dbUsers)
  process.kill();
})
