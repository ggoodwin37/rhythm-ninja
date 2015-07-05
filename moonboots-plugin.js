function getMoonbootsPlugin(config) {
	var moonbootsPlugin = {
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
						templatizer(__dirname + '/client/templates', __dirname + '/client/templates.js');
					}

				}
			}
		}
	};
	return moonbootsPlugin;
}

module.exports = getMoonbootsPlugin;
