var startServerInstance = require('../../server-instance');
var server = startServerInstance(beginCommand);
var StepList = require('../step-list');

function beginCommand() {
	var steps = new StepList();

	steps.addStep(function(done) {
		var url = '/api/set';
		server.inject({method: 'get', url: url}, function(res) {
			console.log('I saw num sets: ' + res.result.length);
			done();
		});
	});

	steps.addStep(function(done) {
		var url = '/api/set/all/pattern';
		server.inject({method: 'get', url: url}, function(res) {
			console.log('I saw num patterns: ' + res.result.length);
			done();
		});
	});

	steps.execute(function() {
		server.stop(function() {
			console.log('done.');
		});
	});
}
