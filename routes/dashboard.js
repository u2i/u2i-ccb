var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Team = mongoose.model('Team');

router.get('/', function(req, res) {
    res.render('dashboard.jade');
});

module.exports = router;
