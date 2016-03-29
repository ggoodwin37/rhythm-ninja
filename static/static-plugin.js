'use strict';

// simple hapi plugin that handles static stuff.
var staticPlugin = {
	register: function(server, options, next) {
		
		next();
	}
};

staticPlugin.register.attributes = {
	name: 'rhythm-ninja-static-plugin',
	version: '1.0.0'
};

module.exports = staticPlugin;
