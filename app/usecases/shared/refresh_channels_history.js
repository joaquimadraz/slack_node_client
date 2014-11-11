var SlackCli = require('../../../slack_cli');
var RefreshHistory = require('../channel_history/refresh_history');

module.exports = refreshChannelsHistory;

function refreshChannelsHistory(context, usecaseFinished) {

  SlackCli.channels.list({}, function(error, response, body){

    if(error != undefined)
      usecaseFinished(true, null);

    var channels = body.channels;
    var refreshedChannels = []

    channels.forEach(function(channel){

      RefreshHistory({ channelId: channel.id }, function(err, channel){
        refreshedChannels.push(channel.name);
        // NAO ESTA A BUSCAR O DEV
        if(refreshedChannels.length == channels.length)
          usecaseFinished(false, refreshedChannels);
      });

    });

  });
}
