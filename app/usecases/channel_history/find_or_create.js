var SlackCli = require('../../../slack_cli');
var ChannelHistory = require('mongoose').model('ChannelHistory');

module.exports = findOrCreate;

function findOrCreate(context, usecaseFinished) {

  SlackCli.channels.info({ channel: context.channelId }, afterRequest);

  function afterRequest(error, response, body){

    var channelJson = body.channel;

    if(context.channelId == undefined || body == undefined)
      usecaseFinished(true, null);

    ChannelHistory.findOne({ channelId: channelJson.id }, checkResult);

    function checkResult(err, channel){
      var _channel = channel;

      if(_channel == null){
        _channel = new ChannelHistory({
          channelId: channelJson.id,
          name: channelJson.name
        });

        _channel.save(function(){
          callUsecaseFinished();
        });
      } else
        callUsecaseFinished();

      function callUsecaseFinished(){
        usecaseFinished(false, _channel);
        return;
      }
    }

  }
}
