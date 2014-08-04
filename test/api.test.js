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


function getRouteKey(route) {
	var routeKey = route.method.toLowerCase() + ' ' + route.path;
	return routeKey;
}

var server, table;

before(function(done) {
	server = new Hapi.Server(8080, 'localhost');
	server.pack.register(getApiPlugin(), function (err) {
		if (err) throw err;
		server.start(function () {
			console.log('test is running at', server.info.uri);

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
		expect(server).to.exist;
		done();
	});

	it('has a route table', function(done) {
		table = server.table();
		expect(table).to.exist;
		done();
	});

	it('can dump all routes', function(done) {
		table.forEach(function(route) {
			console.log('server has route: ' + getRouteKey(route));
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
			expect(table.some(function(route) {
				return getRouteKey(route) == expectedRoute;
			})).to.equal(true);
		});
		done();
	});

	// this test is causing a count leak, huh? using -l when running tests to avoid this.
	it('can create a test1 object', function (done) {
		server.inject({
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
		server.inject({
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
		server.inject({
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
		server.inject({
			method: 'delete',
			url: '/api/test1/' + 'bogus'
		}, function (res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('can delete test1 object', function (done) {
		server.inject({
			method: 'delete',
			url: '/api/test1/' + test1Id
		}, function (res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should not find the object we just deleted', function (done) {
		server.inject({
			method: 'get',
			url: '/api/test1/' + test1Id
		}, function (res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});
});

describe('set-api', function () {
	var setName = 'reserved-test-asdjfjjadsfh';
	var baseSetUrl = '/api/set/' + setName;

	it('should delete any existing test documents', function(done) {
		server.inject({
			method: 'delete',
			url: baseSetUrl
		}, function(res) {
			expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
			done();
		});
	});

	it('should fail to delete a non-existent document', function(done) {
		server.inject({
			method: 'delete',
			url: baseSetUrl
		}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	var setDoc;

	it('should lazy create and return a new document', function(done) {
		server.inject({
			method: 'get',
			url: baseSetUrl
		}, function(res) {
			expect(res.statusCode).to.equal(200);

			// console.log('========== new doc:');
			// inspect(res.result);
			// console.log('===================');

			expect(res.result).to.be.an('object');
			expect(res.result.name).to.equal(setName);

			setDoc = res.result;
			console.log('client sees key: ' + setDoc.key);

			done();
		});
	});

	it('should handle updates to set data', function(done) {
		setDoc.setInfo.bpm = 160;

		// console.log('========== updating local doc:');
		// inspect(setDoc);
		// console.log('==============================');

		server.inject({
			method: 'put',
			url: baseSetUrl,
			payload: JSON.stringify(setDoc)
		}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.setInfo.bpm).to.equal(160);
			setDoc = res.result;
			done();
		});
	});

	it('should start with an empty pool on set endpoint', function(done) {
		expect(setDoc.pool.length).to.equal(0);
		server.inject({method: 'get', url: baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.pool.length).to.equal(0);
			setDoc = res.result;
			done();
		});
	});

	var baseSetPoolUrl = '/api/set/' + setName + '/poolEntry';
	var poolEntryId1;
	it('should allow me to create a new poolEntry', function(done) {
		var poolEntry = {
			name: 'test-pool-entry-post',
			volume: 0.75,
			sampleType: 'local',
			sampleId: 'abcd-efgh'
		};
		server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.volume).to.equal(0.75);
			poolEntryId1 = res.result.key;
			done();
		});
	});

	it('should have added the new pool entry to the set for me', function(done) {
		server.inject({method: 'get', url: baseSetUrl}, function(res) {
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
		server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.volume).to.equal(0.5);
			poolEntryId2 = res.result.key;
			server.inject({method: 'get', url: baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(2);
				expect(res.result.pool[1].key).to.equal(poolEntryId2);
				expect(res.result.pool[1].volume).to.equal(0.5);
				done();
			});
		});
	});

	it('should allow me to delete the first poolEntry now', function(done) {
		server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
			expect(res.statusCode).to.equal(200);
			done();
		});
	});

	it('should fail to delete the thing we just deleted', function(done) {
		server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	it('should have removed the deleted pool entry from the set', function(done) {
		server.inject({method: 'get', url: baseSetUrl}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result.pool.length).to.equal(1);
			expect(res.result.pool[0].key).to.equal(poolEntryId2);
			expect(res.result.pool[0].volume).to.equal(0.5);
			done();
		});
	});
});
