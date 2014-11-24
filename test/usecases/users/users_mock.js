var SlackCli = require('../../../slack_cli');
var hock = require('hock');
var http = require('http');

var mock = hock.createHock();
    mock
      .get('/api/users.list?token=')
      .many()
      .reply(200,
        {
          ok: true,
          members:
           [ { id: 'U025YGFC8',
               name: 'esquim.adraz',
               deleted: false,
               status: null,
               color: '99a949',
               real_name: 'Esquim',
               skype: '',
               phone: '',
               tz: 'Europe/London',
               tz_label: 'Greenwich Mean Time',
               tz_offset: 0,
               profile: [Object],
               is_admin: false,
               is_owner: false,
               is_primary_owner: false,
               is_restricted: false,
               is_ultra_restricted: false,
               is_bot: false,
               has_files: true },
             { id: 'U025Z0YV0',
               name: 'slb-tuga',
               deleted: false,
               status: null,
               color: 'df3dc0',
               real_name: '',
               skype: '@USLACKBOT: help',
               phone: null,
               tz: 'Europe/London',
               tz_label: 'Greenwich Mean Time',
               tz_offset: 0,
               profile: [Object],
               is_admin: false,
               is_owner: false,
               is_primary_owner: false,
               is_restricted: false,
               is_ultra_restricted: false,
               is_bot: false,
               has_files: true } ]
        }
      );

module.exports = http.createServer(mock.handler);
