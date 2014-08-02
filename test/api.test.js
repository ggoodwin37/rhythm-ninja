var Lab = require('lab');
var Hapi = require('hapi');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

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
			expect(res.result).to.have.keys('id', 'testField');
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
			expect(res.result).to.have.keys('id', 'testField');
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
			expect(res.result).to.have.keys('id', 'testField');
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
	var baseUrl = '/api/set/' + setName;

	it('should delete any existing test documents, if they exist', function(done) {
		server.inject({
			method: 'delete',
			url: baseUrl
		}, function(res) {
			expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
			done();
		});
	});

	it('should fail to delete a non-existent document', function(done) {
		server.inject({
			method: 'delete',
			url: baseUrl
		}, function(res) {
			expect(res.statusCode).to.equal(404);
			done();
		});
	});

	var setDoc;

	it('should lazy create and return a new document', function(done) {
		server.inject({
			method: 'get',
			url: baseUrl
		}, function(res) {
			expect(res.statusCode).to.equal(200);

			console.log('========== new doc:');
			inspect(res.result);
			console.log('===================');

			expect(res.result).to.be.an('object');
			expect(res.result).to.have.keys('name', 'setInfo', 'pool', 'patterns', 'song');
			setDoc = res.result;
			done();
		});
	});

	it('should handle updates to set data', function(done) {
		setDoc.setInfo.bpm = 160;

		console.log('========== updating local doc:');
		inspect(setDoc);
		console.log('==============================');

		server.inject({
			method: 'put',
			url: baseUrl,
			payload: JSON.stringify(setDoc)
		}, function(res) {
			expect(res.statusCode).to.equal(200);
			expect(res.result).to.be.an('object');
			expect(res.result.setInfo.bpm).to.equal(160);
			done();
		});
	});
});
