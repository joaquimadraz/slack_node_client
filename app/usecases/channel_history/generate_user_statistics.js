var ChannelHistory = require('mongoose').model('ChannelHistory');
var User = require('mongoose').model('User');

module.exports = generateUserStatistics;

function generateUserStatistics(context, usecaseFinished) {

  if(context.channelName == undefined)
    usecaseFinished(true)

  var aggregation = [
    { $project: { _id: 0, name: 1, messages: 1 } },
    { $match: { name: context.channelName } },
    { $unwind: '$messages' },
    { $group: { _id: '$messages.userId', count: { $sum: 1 } } }
  ];

  ChannelHistory.aggregate(aggregation).exec(afterExec);

  function afterExec(err, result){
    if(err) usecaseFinished(true, err);

    var serialized = [];

    if(result.length == 0) usecaseFinished(false, []);

    result.forEach(serializeResult);

    function serializeResult(userData){

      User.findOne({ userId: userData._id }, function(err, user){

        if(err) usecaseFinished(true, err);

        serialized.push({
          username: user.username,
          count: userData.count
        });

        if(serialized.length == result.length)
          usecaseFinished(false, serialized);
      });

    }

  }
}
