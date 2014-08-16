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

	var setName = 'example';
	stepList.addStep(function(cb) {
		server.inject({method: 'delete', url: '/api/set/' + setName}, function(res) {
			cb();
		});
	});

	stepList.execute(beGone);
}
