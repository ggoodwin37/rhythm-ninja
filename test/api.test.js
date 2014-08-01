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
	it('has expected routes', function(done) {
		expect(table.some(function(route) {
			return route.path == '/api/test1/{test1_id}';
		})).to.equal(true);
		done();
	});

    it('responds to test1 get', function (done) {
        server.inject({
            method: 'get',
            url: '/api/test1/test-id'
        }, function (res) {
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.be.an('object');
            expect(res.result).to.have.keys('id', 'name');
            done();
        });
    });
});
