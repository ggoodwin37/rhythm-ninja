var Lab = require('lab');
var Hapi = require('hapi');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

var getApiPlugin = require('../api/api');
var Test1Model = require('../api/models/test1');

// Test shortcuts
var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;


// shared test context
var ctx = {
	server: null,
	table: null,

	setName: null,
	baseSetUrl: null,
	setDoc: null,

	getRouteKey: function(route) {
		var routeKey = route.method.toLowerCase() + ' ' + route.path;
		return routeKey;
	}

};

before(function(done) {
	ctx.server = new Hapi.Server(8080, 'localhost');
	ctx.server.pack.register(getApiPlugin(), function (err) {
		if (err) throw err;
		ctx.server.start(function () {
			console.log('test is running at', ctx.server.info.uri);

			// clear all test1Models
			// TODO: figure out how to clean up non-wipeable stuff (once we start testing real data types)
			Test1Model.wipe(function(err) {
				if (err) {
					console.log('Error wiping test1');
				}
				done();
			});
		});
	});
});

describe('server', function () {

	it('starts a serverInstance', function(done) {
		expect(ctx.server).to.exist;
		done();
	});

	it('has a route table', function(done) {
		ctx.table = ctx.server.table();
		expect(ctx.table).to.exist;
		done();
	});

	it('can dump all routes', function(done) {
		ctx.table.forEach(function(route) {
			console.log('server has route: ' + ctx.getRouteKey(route));
		});
		done();
	});

});

describe('test-api', function () {
	var test1Id;
	var test1Name = 'test-name-content';

	it('has expected routes', function(done) {
		var expectedRoutes = [
			'get /api/test1/{test1_id}',
			'put /api/test1/{test1_id}',
			'delete /api/test1/{test1_id}',
			'post /api/test1'
		];
		expectedRoutes.forEach(function(expectedRoute) {
			expect(ctx.table.some(function(route) {
				return ctx.getRouteKey(route) == expectedRoute;
			})).to.equal(true);
		});
		done();
	});

	// this test is causing a count leak, huh? using -l when running tests to avoid this.
	it('can create a test1 object', function (done) {
		ctx.server.inject({
			method: 'post',
			url: '/api/test1',
			payload: JSON.stringify({testField: test1Name})
		}, function (res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.testField).to.equal(test1Name);
			test1Id = res.result.id;
			done();
		});
	});

	it('can retrieve test1 object', function (done) {
		ctx.server.inject({
			method: 'get',
			url: '/api/test1/' + test1Id
		}, function (res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.testField).to.equal(test1Name);
			done();
		});
	});

	it('can update test1 object', function (done) {
		ctx.server.inject({
			method: 'put',
			url: '/api/test1/' + test1Id,
			payload: JSON.stringify({testField: test1Name + 'mod'})
		}, function (res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.testField).to.equal(test1Name + 'mod');
			done();
		});
	});

	it('should not delete non-existent object', function (done) {
		ctx.server.inject({
			method: 'delete',
			url: '/api/test1/' + 'bogus'
		}, function (res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('can delete test1 object', function (done) {
		ctx.server.inject({
			method: 'delete',
			url: '/api/test1/' + test1Id
		}, function (res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should not find the object we just deleted', function (done) {
		ctx.server.inject({
			method: 'get',
			url: '/api/test1/' + test1Id
		}, function (res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});
});

ctx.setName = 'reserved-test-asdjfjjadsfh';
ctx.baseSetUrl = '/api/set/' + ctx.setName;
ctx.setDoc;
describe('set-api-set', function () {

	it('should delete any existing test documents', function(done) {
		ctx.server.inject({
			method: 'delete',
			url: ctx.baseSetUrl
		}, function(res) {
			expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
			done();
		});
	});

	it('should fail to delete a non-existent document', function(done) {
		ctx.server.inject({
			method: 'delete',
			url: ctx.baseSetUrl
		}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('should lazy create and return a new document', function(done) {
		ctx.server.inject({
			method: 'get',
			url: ctx.baseSetUrl
		}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.name).to.equal(ctx.setName);
			expect(res.result.song === undefined).to.equal(false);

			ctx.setDoc = res.result;
			console.log('client sees key: ' + ctx.setDoc.key);

			done();
		});
	});

	it('should handle updates to set data', function(done) {
		ctx.setDoc.setInfo.bpm = 160;
		ctx.server.inject({
			method: 'put',
			url: ctx.baseSetUrl,
			payload: {setInfo: ctx.setDoc.setInfo}
		}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.setInfo.bpm).to.equal(160);
			expect(res.result.song === undefined).to.equal(false);
			ctx.setDoc = res.result;
			done();
		});
	});

	it('should not have touched data that we didn\'t update', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.song === undefined).to.equal(false);
			done();
		});
	});

});

describe('set-api-pool-entry', function() {

	it('should start with an empty pool on set endpoint', function(done) {
		expect(ctx.setDoc.pool.length).to.equal(0);
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.pool.length).to.equal(0);
			ctx.setDoc = res.result;
			done();
		});
	});

	var baseSetPoolUrl = '/api/set/' + ctx.setName + '/poolEntry';
	var poolEntryId1;
	it('should allow me to create a new poolEntry', function(done) {
		var poolEntry = {
			name: 'test-pool-entry-post',
			volume: 0.75,
			sampleType: 'local',
			sampleId: 'abcd-efgh'
		};
		ctx.server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.volume).to.equal(0.75);
			poolEntryId1 = res.result.key;
			done();
		});
	});

	it('should have added the new pool entry to the set for me', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.pool.length).to.equal(1);
			expect(res.result.pool[0].key).to.equal(poolEntryId1);
			expect(res.result.pool[0].volume).to.equal(0.75);
			done();
		});
	});

	var poolEntryId2;
	it('should allow me to create a second poolEntry', function(done) {
		var poolEntry = {
			name: 'test-pool-entry-post',
			volume: 0.5,
			sampleType: 'local',
			sampleId: 'abcd-efgh'
		};
		ctx.server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.volume).to.equal(0.5);
			poolEntryId2 = res.result.key;
			console.log('poolEntryId1: ' + poolEntryId1 + ' poolEntryId2: ' + poolEntryId2);
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(2);
				expect(res.result.pool[1].key).to.equal(poolEntryId2);
				expect(res.result.pool[1].volume).to.equal(0.5);
				done();
			});
		});
	});

	it('should allow me to delete the first poolEntry now', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should fail to delete the thing we just deleted', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('should have removed the deleted pool entry from the set', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.pool.length).to.equal(1);
			expect(res.result.pool[0].key).to.equal(poolEntryId2);
			expect(res.result.pool[0].volume).to.equal(0.5);
			ctx.setDoc = res.result;
			done();
		});
	});
});

describe('set-api-pattern', function() {

	it('should start with an empty pattern list on set endpoint', function(done) {
		expect(ctx.setDoc.patterns.length).to.equal(0);
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.patterns.length).to.equal(0);
			ctx.setDoc = res.result;
			done();
		});
	});

	var baseSetPatternUrl = '/api/set/' + ctx.setName + '/pattern';
	var patternId1;
	it('should allow me to create a new pattern', function(done) {
		var pattern = {
			name: 'test-pattern-post',
			length: 12,
			locked: false
		};
		ctx.server.inject({method: 'post', url: baseSetPatternUrl, payload: JSON.stringify(pattern)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.length).to.equal(12);
			patternId1 = res.result.key;
			done();
		});
	});

	it('should create patterns without any rows initially', function(done) {
		ctx.server.inject({method: 'get', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.length).to.equal(12);
			expect(res.result.rows.length).to.equal(0);
			done();
		});
	});

	it('should have added the new pattern to the set for me', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.patterns.length).to.equal(1);
			expect(res.result.patterns[0].key).to.equal(patternId1);
			expect(res.result.patterns[0].length).to.equal(12);
			done();
		});
	});

	var patternId2;
	it('should allow me to create a second pattern', function(done) {
		var pattern = {
			name: 'test-pattern-post-2',
			length: 14,
			locked: false
		};
		ctx.server.inject({method: 'post', url: baseSetPatternUrl, payload: JSON.stringify(pattern)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.length).to.equal(14);
			patternId2 = res.result.key;
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(2);
				expect(res.result.patterns[1].key).to.equal(patternId2);
				expect(res.result.patterns[1].length).to.equal(14);
				done();
			});
		});
	});

	it('should allow me to delete the first pattern now', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should fail to delete the thing we just deleted', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('should have removed the deleted pattern from the set', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.patterns.length).to.equal(1);
			expect(res.result.patterns[0].key).to.equal(patternId2);
			expect(res.result.patterns[0].length).to.equal(14);
			ctx.setDoc = res.result;
			done();
		});
	});

	it('should allow us to modify an existing pattern metadata (not row)', function(done) {
		var patternData = {
			name: 'pattern-updated',
			length: 16
		};
		ctx.server.inject({method: 'put', url: baseSetPatternUrl + '/' + patternId2, payload: JSON.stringify(patternData)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.length).to.equal(16);
			expect(res.result.name).to.equal('pattern-updated');
			done();
		});
	});

	var baseSetPatternRowUrl;
	var patternRowId1;
	it('should accept a new pattern row', function(done) {
		baseSetPatternRowUrl = baseSetPatternUrl + '/' + patternId2 + '/rows';
		var rowData = {
			poolEntry: 'test-pool-entry',
			steps: [0, 101, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
		};
		ctx.server.inject({method: 'post', url: baseSetPatternRowUrl, payload: JSON.stringify(rowData)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.poolEntry).to.equal('test-pool-entry');
			expect(res.result.steps.length).to.equal(16);
			expect(res.result.steps[1]).to.equal(101);
			patternRowId1 = res.result.key;
			done();
		});
	});

	it('should let me edit an existing pattern row', function(done) {
		var rowData = {
			steps: [0, 1, 22, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
		};
		ctx.server.inject({method: 'put', url: baseSetPatternRowUrl + '/' + patternRowId1, payload: JSON.stringify(rowData)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.poolEntry).to.equal('test-pool-entry');
			expect(res.result.steps.length).to.equal(16);
			expect(res.result.steps[1]).to.equal(1);
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0].rows.length).to.equal(1);
				expect(res.result.patterns[0].rows[0].poolEntry).to.equal('test-pool-entry');
				expect(res.result.patterns[0].rows[0].steps.length).to.equal(16);
				expect(res.result.patterns[0].rows[0].steps[1]).to.equal(1);
				expect(res.result.patterns[0].rows[0].steps[2]).to.equal(22);
				ctx.setDoc = res.result;
				done();
			});
		});
	});

	var patternRowId2;
	it('should accept a second pattern row', function(done) {
		console.log('patternId1: ' + patternId1 + ' patternId2: ' + patternId2);
		baseSetPatternRowUrl = baseSetPatternUrl + '/' + patternId2 + '/rows';
		var rowData = {
			poolEntry: 'test-pool-entry-2',
			length: 2,
			steps: [9, 8]  // not consistent since pattern now has length 16, but not expecting any code to catch this yet.
		};
		ctx.server.inject({method: 'post', url: baseSetPatternRowUrl, payload: JSON.stringify(rowData)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.poolEntry).to.equal('test-pool-entry-2');
			expect(res.result.steps.length).to.equal(2);
			expect(res.result.steps[1]).to.equal(8);
			patternRowId2 = res.result.key;
			console.log('patternRowId1: ' + patternRowId1 + ' patternRowId2: ' + patternRowId2);
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0].rows.length).to.equal(2);
				expect(res.result.patterns[0].rows[1].key).to.equal(patternRowId2);
				expect(res.result.patterns[0].rows[1].steps.length).to.equal(2);
				expect(res.result.patterns[0].rows[1].steps[0]).to.equal(9);
				done();
			});
		});
	});

	it('should let me delete the first pattern row', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetPatternRowUrl + '/' + patternRowId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			ctx.server.inject({method: 'get', url: baseSetPatternUrl + '/' + patternId2}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(1);
				expect(res.result.rows[0].key).to.equal(patternRowId2);
				expect(res.result.rows[0].steps[0]).to.equal(9);
				done();
			});
		});
	});

});

describe('set-api-song', function() {

	it('should start with an empty song on set endpoint', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.song.rows.length).to.equal(0);
			ctx.setDoc = res.result;
			done();
		});
	});

	var baseSetSongUrl = '/api/setSong/' + ctx.setName;

	it('can modify song-level data', function(done) {
		expect(ctx.setDoc.song.locked).to.equal(false);
		ctx.server.inject({method: 'put', url: baseSetSongUrl, payload: {locked: true}}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.locked).to.equal(true);
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.song.locked).to.equal(true);
				done();
			});
		});
	});

	var songRowId1;
	it('handles adding a song row', function(done) {
		var songRowData = {
			patternId: 'some-pattern',
			offset: 1,
			len: 2,
			count: 3
		};
		ctx.server.inject({method: 'post', url: baseSetSongUrl + '/songRows', payload: songRowData}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.offset).to.equal(1);
			expect(res.result.count).to.equal(3);
			songRowId1 = res.result.key;
			done();
		});
	});

	it('should update set and song when I do that', function(done) {
		ctx.server.inject({method: 'get', url: baseSetSongUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.rows.length).to.equal(1);
			expect(res.result.rows[0].len).to.equal(2);
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.song.rows.length).to.equal(1);
				expect(res.result.song.rows[0].patternId).to.equal('some-pattern');
				done();
			});
		});
	});

	var songRowId2;
	it('handles adding another song row', function(done) {
		var songRowData = {
			patternId: 'some-other-pattern',
			offset: 11,
			len: 22,
			count: 33
		};
		ctx.server.inject({method: 'post', url: baseSetSongUrl + '/songRows', payload: songRowData}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.offset).to.equal(11);
			expect(res.result.count).to.equal(33);
			songRowId2 = res.result.key;
			done();
		});
	});

	it('doesn\'t mind deleting the first song row', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetSongUrl + '/songRows/' + songRowId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should update set view of song after deleting that row', function(done) {
		ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.song.rows.length).to.equal(1);
			expect(res.result.song.rows[0].key).to.equal(songRowId2);
			done();
		});
	});

	it('should 404 when trying to delete the thing we just deleted', function(done) {
		ctx.server.inject({method: 'delete', url: baseSetSongUrl + '/songRows/' + songRowId1}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('should handle updates to a songRow', function(done) {
		var updatedData = {
			len: 55
		};
		ctx.server.inject({method: 'put', url: baseSetSongUrl + '/songRows/' + songRowId2, payload: JSON.stringify(updatedData)}, function(res) {
			expect(res.statusCode).to.equal(200);
			ctx.server.inject({method: 'get', url: baseSetSongUrl + '/songRows/' + songRowId2}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patternId).to.equal('some-other-pattern');
				expect(res.result.len).to.equal(55);
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.song.rows[0].len).to.equal(55);
					done();
				});
			});
		});
	});

});
