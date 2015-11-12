$(document).ready(function() {
    initLeaderboard();

    var socket = io('http://localhost:3000');

    socket.on('ChallengeStarted', function(challengeData) {
	challenge = JSON.parse(challengeData);
	setCurrentChallengeInfo(challenge);
    });

    socket.on('ChallengeFinished', function() {
	setNoChallengeInfo();
    });
});

function initLeaderboard() {
    setNoChallengeInfo();
}

function setCurrentChallengeInfo(challenge) {
    var currentChallengeInfo = 'Current challenge: ' + challenge['name'];
    $('#current-challenge').html(currentChallengeInfo);
}

function setNoChallengeInfo() {
    $('#current-challenge').html('No challenges currently active.');
}
