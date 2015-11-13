'use strict';

require('./models');
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

exports.activate = function(teamToken, callback) {
    Team.findOne({token: teamToken})
	.exec()
	.then(team => {
	    if(team === null) {
		callback('Incorrect token');
	    } else {
		team.active = true;
		team.save()
		    .then(team => {
			callback(null, team);
		    });
	    }
	});
}
