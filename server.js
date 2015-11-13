'use strict';

var app = require('./lib/app');
var config = require('config');
var server = require('http').Server(app);
var io = require('socket.io')(server);

var team = require('./lib/team');

server.listen(config.port);

app.eventEmitter.on('ChallengeStarted', challengeData => {
  io.emit('ChallengeStarted', challengeData);
});

app.eventEmitter.on('ChallengeFinished', challengeData => {
  io.emit('ChallengeFinished', challengeData);
});

io.on('connection', function(socket) {
    socket.on('TeamConnected', function(teamToken) {
	team.activate(teamToken, function(err, team) {
	    if(err) {
		socket.emit('IncorrectAuthentication', err);
	    } else {
		io.emit('TeamActivated', JSON.stringify(team));
	    }
	});
    });
});
