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

	var setName = 'example';
	var setData = {
		name: setName,
		swing: 0.5,
		bpm: 130
	};
	var poolEntry1Data = {
		name: 'pool-entry-1',
		volume: 1,
		sampleType: 'local',
		sampleId: '1234-5678'
	};
	var poolEntry2Data = {
		name: 'pool-entry-2',
		volume: 0.8,
		sampleType: 'local',
		sampleId: '0123-4567'
	};
	var pattern1Data = {
		name: 'pattern-1',
		length: 16,
		locked: false
	};
	var pattern2Data = {
		name: 'pattern-2',
		length: 16,
		locked: false
	};
	var patternRow1Data = {
		poolEntry: 'pool-entry-1',
		steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0]
	};
	var patternRow2Data = {
		poolEntry: 'pool-entry-2',
		steps: [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
	};
	var songData = {
		name: 'song-1',
		locked: false
	};
	var songRow1Data = {
		pattern_id: 'pattern-1',
		offset: 0,
		len: 16,
		count: 2
	};
	var songRow2Data = {
		pattern_id: 'pattern-2',
		offset: 0,
		len: 16,
		count: 1
	};

	var stepList = new StepList();

	var pattern1Id, pattern2Id, songId;

	stepList.addStep(function(cb) {
		server.inject({method: 'get', url: '/api/set/' + setName}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern', payload: pattern1Data}, function(res) {
			pattern1Id = res.result.id;
			cb();
		});
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern', payload: pattern2Data}, function(res) {
			pattern2Id = res.result.id;
			cb();
		});
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern/' + pattern1Id + '/patternrow', payload: patternRow1Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern/' + pattern1Id + '/patternrow', payload: patternRow2Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern/' + pattern2Id + '/patternrow', payload: patternRow1Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/pattern/' + pattern2Id + '/patternrow', payload: patternRow2Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/poolentry', payload: poolEntry1Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/poolentry', payload: poolEntry2Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/song', payload: songData}, function(res) {
			songId = res.result.id;
			cb();
		});
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/song/' + songId + '/songrow', payload: songRow1Data}, function(result) { cb(); });
	});
	stepList.addStep(function(cb) {
		server.inject({method: 'post', url: '/api/set/' + setName + '/song/' + songId + '/songrow', payload: songRow2Data}, function(result) { cb(); });
	});

	stepList.execute(beGone);
}
