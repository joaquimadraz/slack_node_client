var slackCli = require('../../../slack_cli');
var User = require('mongoose').model('User');

module.exports = getAndCreate;

function getAndCreate(usecaseFinished) {

  // get users from slack
  slackCli.users.list({}, success);

  function success(error, response, body){
    var persisted = [];

    // each user, try to find,
    // if not, persist new user
    if(body == undefined)
      return;

    body.members.forEach(persist)

    function persist(userJson){
      User.findOne({ userId: userJson.id }, checkResult);

      function checkResult(err, user){
        if(user == null){
          var user = new User({
            userId: userJson.id,
            username: userJson.name
          });

          user.save(callUsecaseFinished);
        } else {
          callUsecaseFinished();
        }

        function callUsecaseFinished(){
          persisted.push(user);

          if(persisted.length == body.members.length){
            usecaseFinished(persisted);
            return;
          }
        }
      }
    }
  }

}
