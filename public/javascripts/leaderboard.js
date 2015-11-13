$(document).ready(function() {
    initLeaderboard();

    var socket = io('http://localhost:3000');

    socket.on('ChallengeStarted', function(challengeData) {
	var challenge = JSON.parse(challengeData);
	setCurrentChallengeInfo(challenge);
    });

    socket.on('ChallengeFinished', function() {
	setNoChallengeInfo();
    });

    socket.on('TeamActivated', function(teamData) {
	var team = JSON.parse(teamData);
	addTeam(team);
    });
});

function initLeaderboard() {
    setNoChallengeInfo();
    loadTeamsData();
}

function setCurrentChallengeInfo(challenge) {
    var currentChallengeInfo = 'Current challenge: ' + challenge['name'];
    $('#current-challenge').html(currentChallengeInfo);
}

function setNoChallengeInfo() {
    $('#current-challenge').html('No challenges currently active.');
}

function addTeam(team) {
    var teamInDOM = $('#teams div[rel="' + team.name + '"]')
    if(teamInDOM.length > 0) {
	return;
    }

    var scoresInfo = '';
    $.each(team.scores, function() {
	console.log(this['challenge']);
	scoresInfo += '<p>Solved: ' + this.challenge + '</p>'
    });

    var teamInfo = '<div class="team" rel="' + team.name + '">' +
	'<h3>' + team.name + '</h3>' +
	scoresInfo +
	'</div>';

    $('#teams').append(teamInfo);
}

function loadTeamsData() {
    $.getJSON('/teams/active', function(data) {
	$.each(data, function() {
	    addTeam(this);
	});
    });
}
