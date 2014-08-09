var async = require('async');
var StepList = require('../step-list');
var TypeIter = require('../type-iter');

var startServerInstance = require('../../server-instance');
var server = startServerInstance(beginCommand);
var typeIter = new TypeIter(server);

function beginCommand() {

	var idMap = {};
	function _markExists(key) { idMap[key] = 'exists'; }
	function _markTree(key) { idMap[key] = 'tree'; }

	function markAllExists(params, done) {
		typeIter.getAllOfType(params.url, function(results) {
			results.forEach(function(thisResult) {
				_markExists(thisResult.key);
			});
			done();
		});
	}

	function markAllTree() {
		typeIter.getAllOfType('/api/set', function(setList) {
			setList.forEach(function(thisSet) {

				_markTree(thisSet.id);
				_markTree(thisSet.setInfo.id);

				thisSet.pool.forEach(function(thisPoolEntry) {
					_markTree(thisPoolEntry.id);
				});

				thisSet.patterns.forEach(function(thisPattern) {
					_markTree(thisPattern.id);
					thisPattern.rows.forEach(function(thisPatternRow) {
						_markTree(thisPatternRow);
					});
				});

				_markTree(thisSet.song.id);
				thisSet.song.rows.forEach(function(thisSong) {
					_markTree(thisPoolEntry.id);
				});

			});
		});
	}

	function checkAllForNotTree() {
		var numNotTree = Object.keys(idMap).filter(function(id) {
			return idMap[id] != 'tree';
		}).length;
		console.log('' + numNotTree + ' not tree');
	}

	function beGone() {
		server.stop(function() {
			console.log('done.');
		});
	}

	var stepList = new StepList();
	stepList.addStep(function(callback) {
		typeIter.doForAllTypes(markAllExists, callback);
	});
	stepList.addStep(function(callback) {
		markAllTree();
		callback();
	});
	stepList.addStep(function(callback) {
		checkAllForNotTree();
		callback();
	});
	stepList.execute(beGone);
}
