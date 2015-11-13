var challengesData = [];

$(document).ready(function() {
    populateChallengesTable();
    $('#btn-add-challenge').on('click', addChallenge);
    $('#btn-add-input-output').on('click', addInputOutput);
    $('#btn-add-plugin').on('click', addPlugin);
    $(document).on('click', '#challenges .start-challenge', startChallenge);
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
	    tableContent += '<td><a href="#" class="btn btn-primary btn-xs start-challenge" rel="' + this._id + '">Start</a></td>';
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
	$('#add-challenge .plugins input').remove();
	$('#add-challenge .input-output-fields input').remove();
    });
}

function addInputOutput(event) {
    event.preventDefault();

    var numberOfInputs = $('#add-challenge .input-output-fields input').length / 2;

    htmlContent = '<input name="inputs[' + (numberOfInputs) + ']" type="text" placeholder="Input..." class="form-control">'
    htmlContent += '<input name="outputs[' + (numberOfInputs) + ']" type="text" placeholder="Output..." class="form-control">'

    $('#add-challenge .input-output-fields').append(htmlContent);
}

function addPlugin(event) {
    event.preventDefault();

    var numberOfPlugins = $('#add-challenge .plugins input').length;

    htmlContent = '<input name="plugins[' + (numberOfPlugins + 1) + ']" type="text" placeholder="Plugin..." class="form-control">'

    $('#add-challenge .plugins').append(htmlContent);
}

function startChallenge(event) {
    console.log('started challenge');
    event.preventDefault();

    $.ajax({
	type: 'POST',
	url: '/make-current/' + $(this).attr('rel')
    }).done(function(response) {

    });
}
