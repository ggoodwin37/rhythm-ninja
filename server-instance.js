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
		require('hapi-auth-cookie'),
		require('inert'),
		getApiPlugin(app)
	];
	server.register(plugins, function (err) {
		if (err) throw err;

		// set up oauth login and auth session cookie schemes, needed by API.
		registerAuth(server, app);

		server.route({
			method: 'GET',
			path: '/static/{staticId}',
			handler: function(request, reply) {
				const staticId = request.params.staticId;
				if (staticId === 'react-test') {
					reply.file(__dirname + '/static/react-test.html');
					return;
				}
				reply('Unknown static ID');
			}
		});
		server.start(function () {
			console.log('rhythm-ninja is running at', server.info.uri);
			done && done(server, app);
		});
	});
	return server;
}

module.exports = startServerInstance;
