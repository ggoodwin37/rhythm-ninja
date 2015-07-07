var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	var SampleModel = require('../models/sample.js');

	return {
		show: {
			handler: function(request, reply) {
				console.log('sample show');
				inspect(Object.keys(request));
				reply();
			}
		},
		create: {
			handler: function(request, reply) {
				console.log('sample create');
				// var fields = ['payload', 'mime', 'url', 'query', 'path', 'headers'];
				var fields = ['path', 'mime'];
				inspect(fields.map(function(field) {
					return {
						field: field,
						value: request[field]
					};
				}));
				reply();
			},
			config: {
				payload: {
					parse: false,
					allow: require('./sample-mime-types')
				}
			}
		},
		destroy: {
			handler: function(request, reply) {
				console.log('sample delete');
				inspect(Object.keys(request));
				reply();
			}
		}
	};
};
