var Lab = require('lab');
var Hapi = require('hapi');

var getApiPlugin = require('../api/api');
var Test1Model = require('../api/models/test1');

// Test shortcuts
var before = Lab.before;

// shared test context
var ctx = {
	server: null,
	table: null,

	setName: null,
	baseSetUrl: null,
	setDoc: null,

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
	ctx.server.pack.register(getApiPlugin(), function (err) {
		if (err) throw err;
		ctx.server.start(function () {
			console.log('test is running at', ctx.server.info.uri);

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

require('./test-server.js')(ctx);
require('./test-api.js')(ctx);
require('./test-set-api-set.js')(ctx);
require('./test-set-api-pool-entry.js')(ctx);
require('./test-set-api-pattern.js')(ctx);
require('./test-set-api-song.js')(ctx);
//require('./test-race-order-bug.js')(ctx); // trying to track down a bug where sometimes removing an el leaves unexpected key
