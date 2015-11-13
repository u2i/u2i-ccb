'use strict';

require('./models');

var mongoose = require('mongoose');
var express = require('express');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var app = express();
var config = require('config');
var Challenge = mongoose.model('Challenge');
var Team = mongoose.model('Team');
var EventEmitter = require('events')
  .EventEmitter;

var dashboardRoutes = require('./routes/dashboard');
var teamsRoutes = require('./routes/teams');
var challengesRoutes = require('./routes/challenges');
var leaderboardRoutes = require('./routes/leaderboard');

app.eventEmitter = new EventEmitter();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended': false}));

app.use(methodOverride());
app.use(express.static('public'));

app.use('/dashboard', dashboardRoutes);
app.use('/teams', teamsRoutes);
app.use('/challenges', challengesRoutes);
app.use('/leaderboard', leaderboardRoutes);

app.get('/current-challenge', (req, res) => {
  Challenge.findOne({
      current: true
    })
    .select('-outputs')
    .exec()
    .then(challenge => {
      if (challenge === null) {
        res.sendStatus(404);
      } else {
        res.json(challenge);
      }
    }, () => res.sendStatus(503));
});

app.get('/teams', (req, res) => Team.find()
  .select('-token')
  .then(teams => res.json(teams), () => res.sendStatus(503)));

app.post('/current-challenge/solve', (req, res) => {
  Challenge.findOne({
      current: true
    })
    .then(challenge => {
      if (challenge === null) {
        res.sendStatus(404);
      } else {
        if (Array.isArray(req.body.outputs) &&
          req.body.outputs.length == challenge.outputs.length) {
          let errorCount = 0;
          challenge.outputs.forEach(
            (output, index) => errorCount += (output != req.body.outputs[index] ? 1 : 0));
          if (errorCount) {
            res.status(400)
              .send('Incorrect output ${errorCount} of ${challenge.outputs.length}');
          } else {
            Team.findOne({
                token: req.body.token
              })
              .then(team => {
                if (team === null) {
                  res.sendStatus(404);
                } else {
                  team.scores.push({
                    challenge: challenge,
                  });
                  team.save()
                    .then(() => res.sendStatus(200));
                }
              }, () => res.sendStatus(503));
          }
        } else {
          res.status(400)
            .send('Wrong format');
        }
      }
    }, () => res.sendStatus(503));
});

app.post('/make-current/:id', (req, res) => {
  if (req.body.secret != config.secret) {
    res.sendStatus(401);
  } else {
    Challenge.findById(
        req.params.id
      )
      .then(challenge => {
        if (!req.params.id || challenge === null) {
          res.sendStatus(404);
        } else {
          challenge.current = true;
          challenge.save()
            .then(challenge => {
              app.eventEmitter.emit('ChallengeStarted', JSON.stringify(challenge));
              setTimeout(() => {
                challenge.current = false;
                challenge.save()
                  .then(() => {
                    app.eventEmitter.emit('ChallengeFinished', JSON.stringify(challenge));
                  });
              }, config.challengeLength);
              res.sendStatus(200);
            });
        }
      }, () => res.sendStatus(503));
  }
});

module.exports = app;
