'use strict';

var startedChallengeSchema = {
  type: 'object',
  required: ['name', 'description', 'inputs', 'plugins', 'timeLimit'],
  properties: {
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    inputs: {
      type: 'array',
      minItems: 1,
      items: {
        type: 'string'
      }
    },
    plugins: {
      type: 'array',
      items: {
        type: 'string'
      }
    },
    timeLimit: {
      type: 'integer',
      minimum: 1
    }
  }
};

module.exports = startedChallengeSchema;
