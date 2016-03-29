'use strict';

// simple hapi plugin that handles static stuff.
var staticPlugin = {
	register: function(server, options, next) {
		//server.connection( { labels:['static'] });
		server.route({
			method: 'GET',
			path: '/static',
			handler: function(request, reply) {
				reply('okiedokeee');
			}
		});
		next();
	}
};

staticPlugin.register.attributes = {
	name: 'rn-static',
	version: '1.0.0'
};

module.exports = staticPlugin;
