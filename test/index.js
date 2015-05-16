var Lab = require('lab');
var Hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

var getApiPlugin = require('../api/api');

// Test shortcuts
var before = Lab.before;

// shared test context
var ctx = {
	server: null,
	table: null,

	setName: null,
	baseSetUrl: null,

	app: {config: config},

	getSet: function(done) {
		if (!this.server || !this.baseSetUrl) return done({bad:'fail'}, null);
		this.server.inject({method: 'get', url: this.baseSetUrl}, done);
	},
	inspect: inspect
};

before(function(done) {
	ctx.server = new Hapi.Server();
	ctx.server.connection({
		host: 'localhost',
		port: 8080
	});
	ctx.server.register(getApiPlugin(ctx.app), function (err) {
		if (err) throw err;
		ctx.server.start(function () {
			console.log('test is running at', ctx.server.info.uri);
			done();
		});
	});
});

require('./server')(ctx);
require('./mongo-mongoose')(ctx);
require('./api-set')(ctx);
require('./api-pool-entry')(ctx);
require('./api-pattern')(ctx);
require('./api-set-pattern')(ctx);
require('./api-song')(ctx);
require('./delete-set')(ctx, 'reserved-test-set');
require('./api-tree-ops')(ctx);
require('./delete-set')(ctx, 'reserved-test-tree-stuff');
require('./api-set-tree-ops')(ctx);
require('./api-set-step-updates')(ctx);
require('./api-order')(ctx);
require('./delete-set')(ctx, 'reserved-test-order-stuff');
require('./delete-set')(ctx, 'bogus', 404);
