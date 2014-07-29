var hapi = require('hapi');
var moonboots = require('moonboots_hapi');
var config = require('getconfig');
var templatizer = require('templatizer');

var server = hapi.createServer(config.serverPort, config.serverHost);
server.pack.register({
	plugin: moonboots,
	options: {
		appPath: '/{p*}',
		moonboots: {
			main: __dirname + '/client/app.js',
			developmentMode: config.isDev,
			stylesheets: [
				__dirname + '/dist/css/main.css'
			],
			beforeBuildJS: function() {
				if (config.isDev) {
					templatizer(__dirname + '/templates', __dirname + '/client/templates.js');
				}

			}
		}
	}
}, function() {
	server.start();
	console.log('rhythm-ninja is running at ' + config.serverHost + ':' + config.serverPort);
});
