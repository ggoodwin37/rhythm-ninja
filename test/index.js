var Lab = require('lab');
var Hapi = require('hapi');
var config = require('getconfig');

var getApiPlugin = require('../api/api');

// Test shortcuts
var before = Lab.before;

// shared test context
var ctx = {
	server: null,
	table: null,

	setName: null,
	baseSetUrl: null,
	setDoc: null,

	app: {config: config},

	getRouteKey: function(route) {
		var routeKey = route.method.toLowerCase() + ' ' + route.path;
		return routeKey;
	},
	getSet: function(done) {
		if (!this.server || !this.baseSetUrl) return done({bad:'fail'}, null);
		this.server.inject({method: 'get', url: this.baseSetUrl}, done);
	},
	inspect: require('eyes').inspector({hideFunctions: true, maxLength: null})
};

before(function(done) {
	ctx.server = new Hapi.Server(8080, 'localhost');
	ctx.server.pack.register(getApiPlugin(ctx.app), function (err) {
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
// require('./api-pool-entry')(ctx);
// require('./api-pattern')(ctx);
// require('./api-song')(ctx);
// require('./race-order-bug')(ctx); // trying to track down a bug where sometimes removing an el leaves unexpected key
// require('./api-index')(ctx);
// require('./api-tree-ops')(ctx);
// require('./api-order')(ctx);
