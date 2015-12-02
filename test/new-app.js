'use strict';

if (process.env.NODE_ENV != 'test') {
  throw new Error('Tests need to be run with NODE_ENV set to test');
}

var chai = require('chai');
var chaiHttp = require('chai-http');
var expect = require('chai').expect;
var app = require('../lib/new-app');
var config = require('config');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');

chai.use(chaiHttp);
chai.use(sinonChai);

describe('routes', () => {
  describe('/start-challenge', () => {

    it('returns 401 if secret is incorrect', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret + 'qwe'
        })
        .end((err, res) => {
          expect(res).to.have.status(401);
          expect(res.body).to.deep.equal({
            errors: ['Incorrect or missing secret']
          });
          done();
        });
    });

    it('returns 422 if no challenge provided', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body).to.deep.equal({
            errors: ['Missing challenge']
          });
          done();
        });
    });

    it('returns 422 if challenge fields missing', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret,
          challenge: {}
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.have.length(5);
          done();
        });
    });

    it('returns 422 if challenge fields invalid', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret,
          challenge: {
            name: {},
            description: 2,
            inputs: [],
            plugins: "plugin",
            timeLimit: "one hundred"
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(422);
          expect(res.body.errors).to.have.length(5);
          done();
        });
    });

    it('returns 200 if challenge valid', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret,
          challenge: {
            name: "challange",
            description: "do something",
            inputs: ["a", "b", "c"],
            plugins: ["plugin1", "plugin2"],
            timeLimit: 1
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('returns 200 if challenge valid', done => {
      chai.request(app)
        .post('/start-challenge')
        .send({
          secret: config.secret,
          challenge: {
            name: "challange",
            description: "do something",
            inputs: ["a", "b", "c"],
            plugins: ["plugin1", "plugin2"],
            timeLimit: 1
          }
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });

    it('causes the app emitter to emit a ChallengeStarted event', done => {
      let eventEmitterSpy = sinon.spy(app.eventEmitter, 'emit');
      let challenge = {
        name: "challange",
        description: "do something",
        inputs: ["a", "b", "c"],
        plugins: ["plugin1", "plugin2"],
        timeLimit: 1
      }
      chai.request(app)
        .post('/start-challenge/')
        .send({
          secret: config.secret,
          challenge: challenge
        })
        .end((err, res) => {
          expect(eventEmitterSpy)
            .to.have.been.calledWith('ChallengeStarted', challenge);
          done();
        });
    });
  });
});
