'use strict';

var app = require('./lib/app');
var config = require('config');

app.listen(config.get('port'), function() {
  console.log('Listening on port %d', config.get('port'));
});
