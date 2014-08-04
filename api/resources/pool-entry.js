// TODO: move this into the set handler.
var inspect = require('eyes').inspector({hideFunctions: false, maxLength: null});
var async = require('async');
var SetFactory = require('../models/set');
var PoolEntryFactory = require('../models/pool-entry');

module.exports = {
	show: {
		handler: function(request, reply) {
			var setName = request.params.setPool_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
				var setInstance = result;
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					}
					return reply(new Error(err));
				}
				return reply(setInstance.pool);
			});
		}
	},
	update: {
		handler: function(request, reply) {
			var setName = request.params.setPool_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					}
					return reply(new Error(err));
				}
				reply(result.pool);  // TODO: fix bug in below
				// var poolEntry = PoolEntryFactory.create(request.payload);
				// var setInstance = result;
				// setInstance.pool.push(poolEntry);
				// async.series([
				// 	function(callback) { poolEntry.save(callback); },
				// 	function(callback) { setInstance.save(callback); }
				// ], function() {
				// 	return reply(setInstance.pool);
				// });
			});
		}
	},
	destroy: {
		handler: function(request, reply) {
			return reply('ok');
		}
	}
};
