var SlackCli = require('../../../slack_cli');
var assert = require('chai').assert;
var setup = require('../../setup');
var UserMockServer = require('./users_mock');

var hock = require('hock');
var http = require('http');

describe('GetAndCreate Usecase', function(){

  var core;

  before(function setupTest(done){
    setup(function(_core) {
      core = _core

      SlackCli.setApiBaseURL('http://localhost:3400/api');
      UserMockServer.listen(3400, done);
    });
  });

  it('should create all users that find on api', function(done) {
    SlackCli.users.list({}, afterGetAllUsers);

    function afterGetAllUsers(error, response, body){
      var usersFound = body.members.length;

      core.users.getAndCreate(function(){
        core.db.models.User.count({}, function(err, count){
          assert.equal(usersFound, count);
          done();
        });
      });
    }
  });

  it('should not duplicate users if called 2 times', function(done) {
    SlackCli.users.list({}, afterGetAllUsers);

    function afterGetAllUsers(error, response, body){
      var executed = 0;
      var usersFound = body.members.length;

      core.users.getAndCreate(verifyUsersCount);
      core.users.getAndCreate(verifyUsersCount);

      function verifyUsersCount() {
        executed++;

        if(executed == 2){
          core.db.models.User.count({}, function(err, count){
            assert.equal(usersFound, count);
            done();
          })
        }
      }
    }
  });

});
