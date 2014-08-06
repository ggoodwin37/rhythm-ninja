var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	return {
		index: function(request, reply) {
			// PatternFactory.all(function(err, models, pagination) {
			// 	if (handlingError(err, reply)) return;
			// 	reply(models.map(function(model) { return model.toJSON(); }));
			// });
		},
		show: {
			handler: function(request, reply) {
			}
		},
		create: {
			handler: function(request, reply) {
			}
		},
		destroy: {
			handler: function(request, reply) {
			}
		}
	};
};
