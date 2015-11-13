var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Challenge = mongoose.model('Challenge');

router.get('/', function(req, res) {
    Challenge.find()
	.then(challenges => res.json(challenges),
	      () => res.sendStatus(503));
});

router.post('/', function(req, res) {
    var challenge = new Challenge(req.body);

    challenge.save(function(err, data) {
	if(err) {
	    res.json(err);
	} else {
	    res.json(data);
	}
    });
});

module.exports = router;
