var SetFactory = require('../models/set');
var PoolEntryFactory = require('../models/pool-entry');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

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
					if (handlingError(err, reply)) return;

					setModel.pool.filter(function(thisPoolEl) {
						if (typeof thisPoolEl == 'string') {
							console.log('checking string version');
							return thisPoolEl != poolEntryId;
						} else if (typeof thisPoolEl == 'object' && thisPoolEl.key) {
							console.log('checking object version');
							return thisPoolEl.key != poolEntryId;
						}
					});
					setModel.save(function(err) {
						if (handlingError(err, reply)) return;
						callback();
					});
				});
			},
			function(callback) {
				// TODO: validate set/authenticate
				PoolEntryFactory.delete(poolEntryId, function(err) {
					if (handlingError(err, reply)) return;

					console.log('successfully deleted pool entry itself');
					callback();
				});
			}
		], function() {
			reply();
		});
	}
};
