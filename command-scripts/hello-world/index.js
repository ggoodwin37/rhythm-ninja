var StepList = require('../../step-list');

var startServerInstance = require('../../server-instance');
var server = startServerInstance(beginCommand);

function beginCommand() {

	function beGone() {
		server.stop(function() {
			console.log('done.');
			process.exit();
		});
	}

	var stepList = new StepList();

	// do some stuff up in here.
	stepList.addStep(function(cb) {
		console.log('Hello world');
		setTimeout(cb, 1);
	});

	stepList.execute(beGone);
}
