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

		if (config.twitterAuth) {
			var isSecure = false;  // TODO: enable isSecure (need to turn on https first)
			server.auth.strategy('twitter', 'bell', {
				provider: 'twitter',
				password: config.cookieEncryptionPassword,
				clientId: config.twitterAuth.clientId,
				clientSecret: config.twitterAuth.clientSecret,
				isSecure: isSecure
			});
			server.auth.strategy('session', 'cookie', {
				password: config.cookiePassword,
				cookie: 'sid',
				redirectTo: '/login',
				isSecure: isSecure
			});
			server.route({
				method: ['GET', 'POST'],
				path: '/login',
				config: {
					auth: 'twitter',
					handler: function(request, reply) {
						// TODO: extract and normalize this
						var userInfo = {
							id: request.auth.credentials.profile.id,
							name: request.auth.credentials.profile.username
						};
						request.auth.session.set(userInfo);
						console.log('user logged in:');
						inspect(userInfo);
						// TODO: need to apply session strategy to a test endpoint, and verify request.auth.session there.

						// TODO: figure out what happens here, probably need hapi-auth-cookie hookup here.
						return reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
					}
				}
			});
			// TODO: flesh this out a bit. not crazy about performing the clear on GET either.
			server.route({
				method: 'GET',
				path: '/logout',
				handler: function(request, reply) {
					request.auth.session.clear();
					return reply('<h2>You are now logged out.</h2>');
				}
			});
		}

		server.start(function () {
			console.log('rhythm-ninja is running at', server.info.uri);
			done && done(server);
		});
	});
	return server;
}

module.exports = startServerInstance;
