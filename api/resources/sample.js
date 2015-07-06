var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	var SampleModel = require('../models/sample.js');

	return {
		show: {
			handler: function(request, reply) {
				console.log('sample show');
				inspect(request);
			}
		},
		create: {
			handler: function(request, reply) {
				console.log('sample create');
				inspect(request);
			}
		},
		destroy: {
			handler: function(request, reply) {
				console.log('sample delete');
				inspect(request);
			}
		}
	};
};
