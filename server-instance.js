var hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({maxLength: null});

var getMoonbootsPlugin = require('./moonboots-plugin');
var registerAuth = require('./register-auth');
var getApiPlugin = require('./api/api');

function startServerInstance(done) {

	var app = {
		config: config,
		inspect: inspect
	};

	var server = new hapi.Server();
	server.connection({
		host: config.serverHost,
		port: config.serverPort
	});

	var plugins = [
		getMoonbootsPlugin(config),
		require('bell'),
		require('hapi-auth-cookie')
	];
	server.register(plugins, function (err) {
		if (err) throw err;

		// set up oauth login and auth session cookie schemes, needed by API.
		registerAuth(server, config);

		server.register(getApiPlugin(app), function(err) {
			if (err) throw err;

			server.start(function () {
				console.log('rhythm-ninja is running at', server.info.uri);
				done && done(server);
			});
		});
	});
	return server;
}

module.exports = startServerInstance;
