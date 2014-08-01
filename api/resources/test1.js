var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var Test1Model = require('../models/test1');

module.exports = {
	show: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			var test1Instance = Test1Model.get(id, function(err, result) {
				if (err) {
					console.log('GET error:');
					inspect(err);
					reply(new Error(err));
				}
				reply(result);
			});
		}
	},
	create: {
		handler: function(request, reply) {
			var test1Instance = Test1Model.create(request.payload);
			test1Instance.save(function(err) {
				if (err) {
					console.log('POST error:');
					inspect(err);
					reply(new Error(err));
				}
				reply(test1Instance);
			});
		}
	},
	update: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			var test1Instance = Test1Model.update(id, request.payload, function(err, result) {
				if (err) {
					console.log('PUT error:');
					inspect(err);
					reply(new Error(err));
				}
				reply(result);
			});
		}
	},
	destroy: {
		handler: function(request, reply) {
			var id = request.params.test1_id;
			Test1Model['delete'](id, function(err, result) {
				if (err) {
					console.log('DELETE error:');
					inspect(err);
					reply(new Error(err));
				}
				reply(result);
			});
		}
	}
};
