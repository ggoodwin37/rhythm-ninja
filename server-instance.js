var hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({maxLength: null});
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

	var serverPluginList = [
		{
			register: require('moonboots_hapi'),
			options: {
				// TODO: not optimal. I want '/' and '/set/{p*}' to both be handled by moonboots. how to specify
				//   multiple routes to handle, without making multiple moonboots instances? probably just use a regex.
				appPath: '/set/{p*}',
				moonboots: {
					main: __dirname + '/client/app.js',
					developmentMode: config.isDev,
					stylesheets: [
						__dirname + '/dist/css/main.css'
					],
					beforeBuildJS: function() {

						// TODO: investigate the build-time streaming approach
						if (config.isDev) {
							var templatizer = require('templatizer');
							templatizer(__dirname + '/templates', __dirname + '/client/templates.js');
						}

					}
				}
			}
		}
	];

	serverPluginList.push(getApiPlugin(app));

	serverPluginList.push(require('bell'));
	serverPluginList.push(require('hapi-auth-cookie'));

	server.register(serverPluginList, function (err) {
		if (err) throw err;

		registerAuth(config);

		server.start(function () {
			console.log('rhythm-ninja is running at', server.info.uri);
			done && done(server);
		});
	});
	return server;
}

module.exports = startServerInstance;
