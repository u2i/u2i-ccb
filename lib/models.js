'use strict';

var mongoose = require('mongoose');
var timestamps = require('mongoose-timestamp');
var config = require('config');
var dbURI = 'mongodb://' + config.get('mongoUri');

mongoose.connect(dbURI, {
  user: config.get('mongoUser'),
  pass: config.get('mongoPassword')
});
process.on('SIGINT', function() {
  mongoose.connection.close(function() {
    process.exit(0);
  });
});

var challengeSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  description: String,
  inputs: [String],
  outputs: [String],
  plugins: [String],
  current: {
    type: Boolean,
    default: false
  }
});

challengeSchema.plugin(timestamps);

mongoose.model('Challenge', challengeSchema);

var teamScoresSchema = mongoose.Schema({
  challenge: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Challenge',
    required: true
  },
});

teamScoresSchema.plugin(timestamps);

var teamSchema = mongoose.Schema({
  name: {type: String, required: true},
  token: String,
  members: [String],
  active: {type: Boolean, default: false},
  scores: [teamScoresSchema],
});

mongoose.model('Team', teamSchema);

var eventSchema = mongoose.Schema({
    name: {type: String, required: true},
    active: {type: Boolean, default: false}
});

eventSchema.plugin(timestamps);
mongoose.model('Event', eventSchema);
