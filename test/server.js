'use strict';

var config = require('config');
var async = require('async');
var chai = require('chai');
var expect = require('chai')
  .expect;
var app = require('../lib/app');
var io = require('socket.io-client');

var options = {
  transports: ['websocket'],
  'force new connection': true
};

require('../server');

describe('socket.io server', () => {
  it('notifies the client if a new challenge has become active', done => {
    let client = io.connect('localhost:' + config.port, options);
    let data = JSON.stringify({key: value});
    client.on('ChallengeStarted', (challengeData) => {
      expect(challengeData).to.equal(data);
      done();
    });
    app.eventEmitter.emit('ChallengeStarted', data);
  });
});
