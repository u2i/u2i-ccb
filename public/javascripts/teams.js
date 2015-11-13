var teamsData = [];

$(document).ready(function() {
    populateTeamsTable();
    $('#btn-add-team1').on('click', addTeam);
});

function populateTeamsTable() {
    var tableContent = '';

    $.getJSON('/teams', function(data) {
	teamsData = data;

	$.each(data, function() {
	    var members = '';
	    $.each(this.members, function() {
	    	members += this.name + '\n';
	    });

	    tableContent += '<tr>';
	    tableContent += '<td>' + this.name + '</td>';
	    tableContent += '<td>' + this.token + '</td>';
	    tableContent += '<td>' + this.members + '</td>';
	    tableContent += '</tr>';
	});
	$('#teams table tbody').html(tableContent);
    });
};

function addTeam(event) {
    event.preventDefault();

    var newTeam = $('#add-team').serializeArray();
    console.log(newTeam);
    $.ajax({
	type: 'POST',
	data: newTeam,
	url: '/teams',
	dataType: 'JSON'
    }).done(function(response) {
	$('#add-team input').val('');
	populateTeamsTable();
    });
}
