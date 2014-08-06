var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var Test1Model = require('../models/test1');

module.exports = {
	show: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			var test1Instance = Test1Model.get(id, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					}
					return reply(new Error(err));
				}
				reply(result.toJSON());
			});
		}
	},
	create: {
		handler: function(request, reply) {
			var test1Instance = Test1Model.create(request.payload);
			test1Instance.save(function(err) {
				if (err) {
					return reply(new Error(err));
				}
				reply(test1Instance.toJSON());
			});
		}
	},
	update: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			var test1Instance = Test1Model.update(id, request.payload, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					}
					return reply(new Error(err));
				}
				reply(result.toJSON());
			});
		}
	},
	destroy: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			Test1Model.get(id, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					}
					return reply(new Error(err));
				}

				var test1Instance = result;
				test1Instance['delete'](function(err) {
					if (err) {
						return reply(new Error(err));
					}
					reply('ok');
				});
			});
		}
	}
};
