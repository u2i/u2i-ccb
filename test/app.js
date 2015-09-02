'use strict';

if (process.env.NODE_ENV != 'test') {
  throw new Error('Tests need to be run with NODE_ENV set to test');
}

require('../lib/models');

var mongoose = require('mongoose');
var Team = mongoose.model('Team');
var Challenge = mongoose.model('Challenge');
var config = require('config');
var async = require('async');
var Monky = require('monky');
var monky = new Monky(mongoose);
var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai')
  .expect;
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var app = require('../lib/app');

chai.use(chaiHttp);
chai.use(sinonChai);

var clearDb = done => {
  async.each(mongoose.modelNames(), (name, callback) => mongoose.model(name)
    .remove({}, callback),
    done);
};

monky.factory('Team', {
  name: 'Team #n',
  token: '123456#n'
});

monky.factory('Challenge', {
  name: 'Challenge #n',
  description: 'Super challenge number #n',
  inputs: ['abc', 'def', 'ghi', 'jkl'],
  outputs: ['ABC', 'DEF', 'GHI', 'JKL'],
  plugins: ['pluginA#n', 'pluginB#n'],
  current: false
});

describe('routes', () => {
  describe('/current-challenge', () => {
    var activeChallenge;

    before(done => {
      clearDb(() => {
        monky.create('Challenge', {
            current: true
          })
          .then(challenge => {
            activeChallenge = challenge;
            return monky.create('Challenge');
          })
          .then(() => done());
      });
    });

    it('is a success', done => {
      chai.request(app)
        .get('/current-challenge')
        .end((err, res) => {
          expect(res)
            .to.have.status(200);
          done();
        });
    });

    it('returns the current challenge', done => {
      chai.request(app)
        .get('/current-challenge')
        .end((err, res) => {
          expect(res.body.name)
            .to.equal(activeChallenge.name);
          expect(res.body.description)
            .to.equal(activeChallenge.description);
          res.body.inputs.forEach((value, index) => expect(value)
            .to.eql(activeChallenge.inputs[index]));
          expect(res.body.outputs)
            .to.be.undefined;
          res.body.plugins.forEach((value, index) => expect(value)
            .to.eql(activeChallenge.plugins[index]));
          expect(res.body.current)
            .to.be.true;
          done();
        });
    });
  });

  describe('/teams', () => {
    var teams;

    before(done => {
      clearDb(() => {
        monky.createList('Team', 4)
          .then(t => {
            teams = t;
            done();
          });
      });
    });

    it('is a success', done => {
      chai.request(app)
        .get('/teams')
        .end((err, res) => {
          expect(res)
            .to.have.status(200);
          done();
        });
    });

    it('returns the teams', done => {
      chai.request(app)
        .get('/teams')
        .end((err, res) => {
          Team.find()
            .select('-token')
            .then(teams => {
              for (let i = 0; i < 4; i++) {
                expect(res.body[i].name)
                  .to.include(teams[i].name);
                expect(res.body[i].token)
                  .to.be.undefined;
              }
              done();
            });
        });
    });
  });

  describe('/current-challenge/solve', () => {
    var team;
    var challenge;

    before(done => {
      clearDb(() => {
        monky.create('Team')
          .then(t => {
            team = t;
            return monky.create('Challenge', {
              current: true
            });
          })
          .then(c => {
            challenge = c;
            done();
          });
      });
    });

    it('is a success', done => {
      chai.request(app)
        .post('/current-challenge/solve')
        .send({
          outputs: challenge.outputs,
          token: team.token
        })
        .end((err, res) => {
          expect(res)
            .to.have.status(200);
          done();
        });
    });

    it('records the completion of the challenge', done => {
      chai.request(app)
        .post('/current-challenge/solve')
        .send({
          outputs: challenge.outputs,
          token: team.token
        })
        .end((err, res) => {
          Team.findById(team.id)
            .then(team => {
              expect(team.scores[0].challenge.toString())
                .to.equal(challenge.id);
              done();
            });
        });
    });
  });

  describe('/make-current/', () => {
    var challenge;

    before(done => {
      clearDb(() => {
        monky.create('Challenge')
          .then(c => {
            challenge = c;
            done();
          });
      });
    });

    it('is a success', done => {
      chai.request(app)
        .post('/make-current/' + challenge.id)
        .send({
          secret: config.secret
        })
        .end((err, res) => {
          expect(res)
            .to.have.status(200);
          done();
        });
    });

    it('it sets the chosen challenge to be current', done => {
      chai.request(app)
        .post('/make-current/' + challenge.id)
        .send({
          secret: config.secret
        })
        .end((err, res) => {
          Challenge.findById(challenge.id)
            .then(challenge => {
              expect(challenge.current)
                .to.be.true;
              done();
            });
        });
    });

    it('causes the app emitter to emmit a ChallengeStarted event', done => {
      let eventEmitterSpy = sinon.spy(app.eventEmitter, 'emit');
      chai.request(app)
        .post('/make-current/' + challenge.id)
        .send({
          secret: config.secret
        })
        .end((err, res) => {
          Challenge.findById(challenge.id)
            .then(challenge => {
              expect(eventEmitterSpy)
                .to.have.been.calledWith('ChallengeStarted', JSON.stringify(challenge));
              done();
            });
        });
    });
  });
});
