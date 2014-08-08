var TypeIter = require('../type-iter');
var startServerInstance = require('../../server-instance');

var server = startServerInstance(beginCommand);
var typeIter = new TypeIter(server);

function beginCommand() {

	function beGone() {
		server.stop(function() {
			console.log('done.');
		});
	}
	function countAll(params, done) {
		typeIter.countAllOfType(params.typeName, params.url, done);
	}
	typeIter.doForAllTypes(countAll, beGone);
}
