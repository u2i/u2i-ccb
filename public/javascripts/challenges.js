var challengesData = [];

$(document).ready(function() {
    populateChallengesTable();
    $('#btn-add-challenge').on('click', addChallenge);
});

function populateChallengesTable() {
    var tableContent = '';

    $.getJSON('/challenges', function(data) {
	challengesData = data;

	$.each(data, function() {
	    tableContent += '<tr>';
	    tableContent += '<td><a href="#" class="link-show-challenge" rel="' + this.name + '">' + this.name + '</a></td>';
	    tableContent += '<td>' + this.description + '</td>';
	    tableContent += '<td>' + this.inputs + '</td>';
	    tableContent += '<td>' + this.outputs + '</td>';
	    tableContent += '<td>' + this.plugins + '</td>';
	    tableContent += '</tr>';
	});
	$('#challenges table tbody').html(tableContent);
    });
};

function addChallenge(event) {
    event.preventDefault();

    var newChallenge = $('#add-challenge').serializeArray();

    $.ajax({
	type: 'POST',
	data: newChallenge,
	url: '/challenges',
	dataType: 'JSON'
    }).done(function(response) {
	populateChallengesTable();
	$('#add-challenge input').val('');
    });
}
