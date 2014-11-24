var request = require('request');
// remove _dev and put your slack app token on slack_config.js file
var config = require('./config/slack_config_dev');

function SlackCli() {

  var _apiBaseURL = 'https://slack.com/api';
  var _appToken   = config.slackAppToken;

  this.users = {
    list: function(params, onResponse){
      _requestResource('users.list', params, onResponse);
    }
  }

  this.channels = {

    info: function(params, onResponse){
      _requestResource('channels.info', params, onResponse);
    },

    list: function(params, onResponse){
      _requestResource('channels.list', params, onResponse);
    },

    history: function(params, onResponse){
      _requestResource('channels.history', params, onResponse);
    }
  }

  this.setApiBaseURL = function(newBaseUrl){
    _apiBaseURL = newBaseUrl;
  }

  function _requestResource(name, params, onResponse){
    // complete params
    params = params || {};
    params.token = _appToken;

    // if onResponse is not a function, console.log body
    if(!(onResponse instanceof Function)){
      onResponse = function(error, response, body){
        console.log(body);
      }
    }

    request({ url: _resource(name), qs: params, json: true }, onResponse);
  }

  function _resource(name){
    return _apiBaseURL + '/' + name;
  }

}

if(require.main == module){
  var args = process.argv.slice(2);
  var resource = args[0];
  var method = args[1];
  var params = {}

  for (var i = 2; i < args.length; i++) {
    var splited = args[i].split('=');
    params[splited[0]] = splited[1];
  }

  new SlackCli()[resource][method](params);
}

module.exports = new SlackCli();
