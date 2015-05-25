var Lab = require('lab');
var Hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

var startServerInstance = require('../server-instance');

// Test shortcuts
var before = Lab.before;

// shared test context
var ctx = {
	server: null,
	table: null,

	setName: null,
	baseSetUrl: null,

	app: null,

	getSet: function(done) {
		if (!this.server || !this.baseSetUrl) return done({bad:'fail'}, null);
		this.server.inject({method: 'get', url: this.baseSetUrl}, done);
	},
	inspect: inspect
};

before(function(done) {
	startServerInstance(function(server, app) {
		ctx.server = server;
		ctx.app = app;
		console.log('test is running at', ctx.server.info.uri);
		done();
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
