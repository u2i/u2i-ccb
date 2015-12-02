'use strict';

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var config = require('config');
var EventEmitter = require('events').EventEmitter;
var startedChallengeSchema = require('./schema');
var validate = require('jsonschema').validate;

app.eventEmitter = new EventEmitter();
app.use(bodyParser.json());

app.post('/start-challenge', (req, res) => {
  if (req.body.secret != config.secret) {
    res.status(401).send({
      errors: ['Incorrect or missing secret']
    });
  } else if(!req.body.challenge) {
    res.status(422).send({
      errors: ['Missing challenge']
    });
  } else {
    var challenge = req.body.challenge;
    var validationResult = validate(challenge, startedChallengeSchema);
    if(!validationResult.valid) {
      res.status(422).send({
        errors: validationResult.errors.map(e => e.stack)
      });
    } else {
      app.eventEmitter.emit('ChallengeStarted', challenge);
      setTimeout(() => {
        app.eventEmitter.emit('ChallengeFinished');
      }, 1000 * challenge.timeLimit);
      res.sendStatus(200);
    }
  }
});

module.exports = app;
