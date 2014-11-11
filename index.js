var express = require('express');
var config = require('./config/config');
var SlackCli = require('./slack_cli');
var Core = require('./core');

// load files and boot database
var core = Core(config);

// app setup -------------------------------------------------------------------
var app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

app.use(express.static(__dirname + '/app'));

// end app setup ---------------------------------------------------------------

app.get('/', function(req, res){

  core.channel_history.generateUserStatistics({ channelName: 'random' },
    function(err, usersStatistics){
      res.render('index', { usersStatistics: usersStatistics });
    });

});

app.get('/refresh_history', function(req, res){

  core.shared.refreshChannelsHistory({},
    function(err, refreshedChannels){
      res.status((err ? 503 : 200)).json({ channels: refreshedChannels });
    })

});

app.get('/refresh_users', function(req, res){

  core.users.getAndCreate({},
    function(err){
      res.status(err ? 503 : 200).end();
    });

});

app.listen(3000);
