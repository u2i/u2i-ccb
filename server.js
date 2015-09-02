'use strict';

var app = require('./lib/app');
var config = require('config');
var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(config.port);

app.eventEmitter.on('ChallengeStarted', challengeData => {
  io.emit('ChallengeStarted', challengeData);
});

app.eventEmitter.on('ChallengeFinished', challengeData => {
  io.emit('ChallengeFinished', challengeData);
});
