var Lab = require('lab');
var Hapi = require('hapi');

// Test shortcuts
var expect = Lab.expect;
var before = Lab.before;
var after = Lab.after;
var describe = Lab.experiment;
var it = Lab.test;

var server, table;

describe('plugin', function () {
    it('can be added to hapi', function (done) {
        server = new Hapi.Server();
        server.pack.require('../', internals, function (err) {
            expect(err).to.not.exist;

            done();
        });
    });

    it('can add more routes after being loaded', function (done) {
        server.plugins.mudskipper.route(internals_add, function () {
            table = server.table();
            done();
        });
    });
});

describe('root', function () {
    var hypermedia;

    it('registered the additional route', function (done) {
        var found = table.filter(function (route) {
            return (route.method === 'get' && route.path === '/tests');
        });

        expect(found).to.have.length(1);

        done();
    });

    it('registers a route', function (done) {
        var found = table.filter(function (route) {
            return (route.method === 'get' && route.path === '/api');
        });

        expect(found).to.have.length(1);

        done();
    });

    it('responds to index', function (done) {
        server.inject({
            method: 'get',
            url: '/api'
        }, function (res) {
            expect(res.statusCode).to.equal(200);
            expect(res.result).to.be.an('object');
            expect(res.result).to.have.keys('reply', 'hypermedia');
            expect(res.result.reply).to.deep.equal('root');
            expect(res.result.hypermedia).to.be.an('object');
            hypermedia = res.result.hypermedia;

            done();
        });
    });
});

