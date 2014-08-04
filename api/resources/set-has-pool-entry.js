var SetFactory = require('../models/set');
var PoolEntryFactory = require('../models/pool-entry');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = {
	show: function(request, reply) {
		var poolEntryId = request.params.poolEntry_id;
		// TODO: validate set/authenticate
		PoolEntryFactory.get(poolEntryId, function(err, poolEntryModel) {
			if (handlingError(err, reply)) return;
			return reply(poolEntryModel);
		});
	},
	create: function(request, reply) {
		var setName = request.params.set_id;
		var poolEntry = PoolEntryFactory.create(request.payload);
		poolEntry.save(function(err) {
			if (handlingError(err, reply)) return;
			SetFactory.findByIndex('name', setName, function(err, setModel) {
				if (handlingError(err, reply)) return;
				var newPool = setModel.pool.slice(0);
				newPool.push(poolEntry); // .key?

				SetFactory.update(setModel.key, {pool: newPool}, function(err, newModel) {
					// TODO: need to .save too?
					if (handlingError(err, reply)) return;
					reply(poolEntry);
				});
			});
		});
	},
	destroy: function(request, reply) {
		var setName = request.params.set_id;
		var poolEntryId = request.params.poolEntry_id;

		async.series([
			function(callback) {
				// first check the set for any instances of this poolEntryId
				SetFactory.findByIndex('name', setName, function(err, setModel) {
					if (handlingError(err, reply)) return callback();

					var newPool = setModel.pool.slice(0).filter(function(thisPoolEl) {
						return thisPoolEl.key !== poolEntryId;
					});

					SetFactory.update(setModel.key, {pool: newPool}, function(err, newModel) {
						// TODO: need to .save too? I don't think so, since this appears to be working.
						if (handlingError(err, reply)) return callback();
						callback();
					});
				});
			},
			function(callback) {
				// TODO: validate set/authenticate
				PoolEntryFactory.get(poolEntryId, function(err, poolEntryModel) {
					if (handlingError(err, reply)) return callback();
					poolEntryModel.delete(function(err) {
						if (handlingError(err, reply)) return;
						callback();
					});
				});
			}
		], function() {
			reply();
		});
	}
};
