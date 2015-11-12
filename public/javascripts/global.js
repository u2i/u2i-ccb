var teamsData = [];

$(document).ready(function() {
    populateTeamsTable();
    $('#btnAddTeam').on('click', addTeam);
});

function populateTeamsTable() {
    var tableContent = '';

    $.getJSON('/teams', function(data) {
	teamsData = data;

	$.each(data, function() {
	    tableContent += '<tr>';
	    tableContent += '<td><a href="#" class="link-show-team" rel="' + this.name + '">' + this.name + '</a></td>';
	    tableContent += '<td>' + this.token + '</td>';
	    tableContent += '</tr>';
	});
	$('#teams table tbody').html(tableContent);
    });
};

function addTeam(event) {
    event.preventDefault();

    var newTeam = {
	'name': $('#addTeam #inputTeamName').val(),
	'token': $('#addTeam #inputTeamToken').val()
    };

    $.ajax({
	type: 'POST',
	data: newTeam,
	url: '/teams',
	dataType: 'JSON'
    }).done(function(response) {
	populateTeamsTable();
    });
}
