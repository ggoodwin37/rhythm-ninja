var Lab = require('lab');
var Hapi = require('hapi');
var getApiPlugin = require('../api/api');

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
			done();
		});
	});
});

// TODO: figure out how to clean up. What if test dies before we can delete the test object? next run would fail.
//  maybe create a dedicated test bucket that just gets nuked at the start of each test?
// see Model.wipe();

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

describe('api', function () {
	var test1Id;
	var test1Name = 'test-name-content';

	function getRouteKey(route) {
		var routeKey = route.method.toLowerCase() + ' ' + route.path;
		return routeKey;
	}

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
