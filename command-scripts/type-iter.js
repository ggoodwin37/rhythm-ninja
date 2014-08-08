var StepList = require('./step-list');

function TypeIter(server) {
	this.server = server;
}

TypeIter.prototype = {
	// callback({
	// 	typeName: string,
	//  url: string,
	// }, done);
	doForAllTypes: function(callback, done) {
		var steps = new StepList();
		// TODO: make sure we have exactly one endpoint per model
		steps.addStep(function(stepDone) { callback({typeName: 'set', url: '/api/set'}, stepDone); });
		steps.addStep(function(stepDone) { callback({typeName: 'pattern', url: '/api/set/all/pattern'}, stepDone); });
		steps.addStep(function(stepDone) { callback({typeName: 'pattern-row', url: '/api/set/all/pattern/all/rows'}, stepDone); });
		steps.addStep(function(stepDone) { callback({typeName: 'pool-entry', url: '/api/set/all/poolEntry'}, stepDone); });

		steps.addStep(function(stepDone) { callback({typeName: 'song', url: '/api/setSong'}, stepDone); });
		// TODO: make url like this instead
		//steps.addStep(function(stepDone) { callback({typeName: 'song', url: '/api/set/all/song'}, stepDone });

		steps.addStep(function(stepDone) { callback({typeName: 'song-row', url: '/api/setSong/all/songRows'}, stepDone); });

		// doesn't exist yet
		steps.addStep(function(stepDone) { callback({typeName: 'sample', url: '/api/sample'}, stepDone); });

		steps.execute(done);
	},

	countAllOfType: function(typeName, url, done) {
		this.getAllOfType(url, function(list) {
			console.log('found ' + list.length + ' object' + (list.length == 1 ? '' : 's') + ' of type "' + typeName + '"');
			done();
		});
	},

	getAllOfType: function(url, done) {
		this.server.inject({method: 'get', url: url}, function(res) {
			if (res.statusCode != 200) {
				console.log('getAllOfType: failed on ' + url + ' with code ' + res.statusCode);
			}
			done(res.result);
		});
	}
};

module.exports = TypeIter;
