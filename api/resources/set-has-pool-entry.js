var SetFactory = require('../models/set');
var PoolEntryFactory = require('../models/pool-entry');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = function(app) {
	return {
		index: function(request, reply) {
			PoolEntryFactory.all(function(err, models, pagination) {
				if (handlingError(err, reply)) return;
				reply(models.map(function(model) { return model.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var poolEntryId = request.params.poolEntry_id;
			// TODO: validate set/authenticate
			PoolEntryFactory.get(poolEntryId, function(err, poolEntryModel) {
				if (handlingError(err, reply)) return;
				return reply(poolEntryModel.toJSON());
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
					newPool.push(poolEntry);

					SetFactory.update(setModel.key, {pool: newPool}, function(err, newModel) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new poolEntry: ' + poolEntry.key);
						}

						reply(poolEntry.toJSON());
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
};
