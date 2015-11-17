var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Event = mongoose.model('Event');

router.get('/', function(req, res) {
    Event.find()
	.then(events => res.json(events),
	      () => res.sendStatus(503));
});

router.post('/', function(req, res) {
    var event = new Event(req.body);

    event.save(function(err, data) {
	if(err) {
	    res.json(err);
	} else {
	    res.json(data);
	}
    });
});

router.put('/:id', function(req, res) {
    Event.findOneAndUpdate({ id: req.params.id }, req.body, function(err, event) {
	if(err) {
	    res.send(err);
	} else {
	    res.send(event);
	}
    });
});

router.delete('/:id', function(req, res) {
    Event.findByIdAndRemove(req.params.id, function(err) {
	if(err) {
	    res.send(err);
	}
	res.sendStatus(200);
    });
});

module.exports = router;
