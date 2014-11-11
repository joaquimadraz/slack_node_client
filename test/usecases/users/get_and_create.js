var SlackCli = require('../../../slack_cli');
var assert = require('chai').assert;
var setup = require('../../setup');

describe('GetAndCreate Usecase', function(){

  var core;

  before(function setupTest(done){
    setup(function(_core) {
      core = _core
      done();
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
        })
      });

    }
  });

  xit('should not duplicate users if called 2 times');

});
