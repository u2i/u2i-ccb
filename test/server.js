'use strict';

var config = require('config');
var async = require('async');
var chai = require('chai');
var expect = require('chai')
  .expect;
var app = require('../lib/app');
var io = require('socket.io-client');

require('../server');

var options = {
  transports: ['websocket'],
  'force new connection': true
};

describe('socket.io server', () => {
  it('notifies the client if a new challenge has become active', done => {
    let client = io.connect('http://0.0.0.0:' + config.port, options);
    let data = JSON.stringify({key: 'value'});
    client.on('connect', () => app.eventEmitter.emit('ChallengeStarted', data));
    client.on('ChallengeStarted', (challengeData) => {
      expect(challengeData).to.equal(data);
      client.disconnect();
      done();
    });
  });

  it('notifies the client if a challenge has become inactive', done => {
    let client = io.connect('http://0.0.0.0:' + config.port, options);
    let data = JSON.stringify({key: 'value'});
    client.on('connect', () => app.eventEmitter.emit('ChallengeFinished', data));
    client.on('ChallengeFinished', (challengeData) => {
      expect(challengeData).to.equal(data);
      client.disconnect();
      done();
    });
  });
});
