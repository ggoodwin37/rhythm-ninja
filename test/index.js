var Lab = require('lab');
var Hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

var startServerInstance = require('../server-instance');

// Test shortcuts
var lab = exports.lab = Lab.script();
var before = lab.before;

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

require('./server')(ctx, lab);
require('./mongo-mongoose')(ctx, lab);
require('./api-set')(ctx, lab);
require('./api-pool-entry')(ctx, lab);
require('./api-pattern')(ctx, lab);
require('./api-set-pattern')(ctx, lab);
require('./api-song')(ctx, lab);
require('./delete-set')(ctx, lab, 'reserved-test-set');
require('./api-tree-ops')(ctx, lab);
require('./delete-set')(ctx, lab, 'reserved-test-tree-stuff');
require('./api-set-tree-ops')(ctx, lab);
require('./api-set-step-updates')(ctx, lab);
require('./api-order')(ctx, lab);
require('./delete-set')(ctx, lab, 'reserved-test-order-stuff');
require('./delete-set')(ctx, lab, 'bogus', 404);
require('./api-sample')(ctx, lab);
require('./api-sample-search')(ctx, lab);
require('./api-me')(ctx, lab);
