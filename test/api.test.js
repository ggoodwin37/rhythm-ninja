var Lab = require('lab');
var Hapi = require('hapi');
var getApiPlugin = require('../api/api');
var Test1Model = require('../api/models/test1');

// Test shortcuts
var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

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

describe('plugin', function () {
	it('starts a serverInstance', function(done) {
		expect(server).to.exist;
		done();
	});

	it('has a route table', function(done) {
		table = server.table();
		expect(table).to.exist;
		done();
	});
});

describe('test-api', function () {
	var test1Id;
	var test1Name = 'test-name-content';

	// it('can dump all routes', function(done) {
	// 	table.forEach(function(route) {
	// 		console.log('server has route: ' + getRouteKey(route));
	// 	});
	// 	done();
	// });

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

function getRouteKey(route) {
	var routeKey = route.method.toLowerCase() + ' ' + route.path;
	return routeKey;
}