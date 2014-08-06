var hapi = require('hapi');
var config = require('getconfig');
var getApiPlugin = require('./api/api');

function startServerInstance(done) {

	var app = {
		config: config
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

	server.pack.register(require('lout'), function () {});

	var serverPackList = [
		// {
		// 	plugin: require('./notify'),
		// 	options: { publicUrl: 'http://' + config.serverHost + ':' + config.serverPort }
		// },
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

	server.pack.register(serverPackList, function (err) {
		if (err) throw err;

		// TODO: /api/{etc*}  <- actually, do we need to specify api routes here or did mudskipper handle that?

		// server.route(require('./resources/client')());
		// server.route({
		//     method: 'GET',
		//     path: '/public/{param*}',
		//     handler: {
		//         directory: {
		//             path: 'public'
		//         }
		//     }
		// });

		server.start(function () {
			console.log('rhythm-ninja is running at', server.info.uri);
			done && done(server);
		});
	});
	return server;
}

module.exports = startServerInstance;
