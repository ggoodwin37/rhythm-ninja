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

	server.register(serverPluginList, function (err) {
		if (err) throw err;

		if (config.twitterAuth) {
			server.auth.strategy('twitter', 'bell', {
				provider: 'twitter',
				password: config.cookieEncryptionPassword,
				clientId: config.twitterAuth.clientId,
				clientSecret: config.twitterAuth.clientSecret,
				isSecure: true
			});
		}
		server.route({
			method: ['GET', 'POST'],
			path: '/login',
			config: {
				auth: 'twitter',
				handler: function(req, reply) {
					console.log('twitter login handler firing');
					// TODO: figure out what happens here, probably need hapi-auth-cookie hookup here.
					return reply.redirect('/');
				}
			}
		});

		server.start(function () {
			console.log('rhythm-ninja is running at', server.info.uri);
			done && done(server);
		});
	});
	return server;
}

module.exports = startServerInstance;
