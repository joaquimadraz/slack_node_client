var SlackCli = require('../../../slack_cli');
var ChannelHistory = require('mongoose').model('ChannelHistory');
var FindOrCreate = require('./find_or_create');

module.exports = refreshHistory;

function refreshHistory(context, usecaseFinished) {

  FindOrCreate({ channelId: context.channelId }, function(err, channel){

    SlackCli.channels.history({
      channel: channel.channelId,
      oldest: channel.lastTs,
      count: 1000
    }, afterRequest);

    function afterRequest(error, response, body){

      var _channel = channel;

      var newMessages = body.messages;
      var latestMessage = null;

      var updatedMessagesCount = 0;
      var newMessagesCount = newMessages.length;

      if(newMessagesCount > 0){
        latestMessage = newMessages[0];

        newMessages.forEach(saveMessage);

        function saveMessage(messageJson){

          if(['file_comment', 'message_deleted', 'bot_message'].indexOf(messageJson.subtype) > -1){
            newMessagesCount--;
            return;
          }

          var userId = (messageJson.subtype == 'message_changed') ? messageJson.message.user : messageJson.user;
          var text = (messageJson.subtype == 'message_changed') ? messageJson.message.text : messageJson.text;
          var ts = messageJson.ts;

          _channel.messages.push({
            userId: userId,
            text:   text,
            ts:     ts
          });

          _channel.save(function(err, doc){
            if(err) newMessagesCount--;

            updatedMessagesCount++;
            updateChannelLastTs(latestMessage.ts);
          });

          function updateChannelLastTs(lastTs){
            if(updatedMessagesCount == newMessagesCount){
              _channel.lastTs = lastTs;
              _channel.save(callUsecaseFinished);
            }
          }
        }

      } else
        callUsecaseFinished();

      function callUsecaseFinished(){
        usecaseFinished(false, channel);
        return;
      }

    }

  });

}
