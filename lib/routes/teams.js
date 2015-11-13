var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

router.get('/', function(req, res) {
    Team.find()
	.then(teams => res.json(teams),
	      () => res.sendStatus(503));
});

router.get('/active', function(req, res) {
    Team.find({active: true})
    	.populate('scores')
    	.exec()
    	.then(teams => res.json(teams),
    	      () => res.sendStatus(503));
});

router.post('/', function(req, res) {
    var team = new Team(req.body);

    team.save(function(err, data) {
	if(err) {
	    res.json(err);
	} else {
	    res.json(data);
	}
    });
});

module.exports = router;
