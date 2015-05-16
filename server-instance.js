var hapi = require('hapi');
var config = require('getconfig');
var inspect = require('eyes').inspector({maxLength: null});
var getApiPlugin = require('./api/api');

function startServerInstance(done) {

	var app = {
		config: config,
		inspect: inspect
	};

	var server = new hapi.Server(config.serverPort, config.serverHost, {
		// not using any server views right now.
		// views: {
		//     engines: { jade: require('jade') },
		//     path: __dirname + '/templates'
		// },

		// haven't tested cors yet
		// cors: {
		//     origin: ['*'],
		//     headers: ['Authorization', 'Content-Type', 'If-None-Match', 'Auth-Token']
		// }
	});

	// wants an older version of hapi. TODO: fix this, or look at swagger or something
	// server.pack.register(require('lout'), function () {});

	var serverPackList = [
		{
			plugin: require('moonboots_hapi'),
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

	serverPackList.push(getApiPlugin(app));
	serverPackList.push(require(bell));

	server.pack.register(serverPackList, function (err) {
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
