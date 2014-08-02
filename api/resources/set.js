var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var SetFactory = require('../models/set');
var SetInfoFactory = require('../models/set-info');
var SongFactory = require('../models/song');
var PoolEntryFactory = require('../models/pool-entry');
var PatternFactory = require('../models/pattern');

function createDefaultPoolEntry() {
	return PoolEntryFactory.create();
}

function createDefaultPattern() {
	return PatternFactory.create();
}

function createSet(setName, reply) {
	var setInfo = SetInfoFactory.create();
	// TODO: might want to have these be empty initially, but stick something in here for now for testing.
	var pool = [createDefaultPoolEntry()];
	var patterns = [createDefaultPattern()];
	var song = SongFactory.create();

	var setInstance = SetFactory.create({
		setInfo: setInfo,
		pool: pool,
		patterns: patterns,
		song: song
	});

	return reply(setInstance.toJSON());
}

module.exports = {
	hasMany: ['pattern', 'sample'],
	show: {
		handler: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.getByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						console.log('lazy creating set with name: ' + setName);
						return createSet(setName, reply);
					}
					return reply(new Error(err));
				}
				reply(result.toJSON());
			});
		}
	},
	update: {
		handler: function(request, reply) {
			// TODO: does this handle updating children as well?
			var setName = request.params.set_id;
			SetFactory.getByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					} else {
						return reply(new Error(err));
					}
				}
				SetFactory.update(result.key, request.payload, function(updateErr, updateResult) {
					if (updateErr) return reply(new Error(updateErr));
					return reply(updateResult.toJSON());
				});
			});
		}
	},
	destroy: {
		handler: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.getByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					} else {
						return reply(new Error(err));
					}
				}
				result['delete'](function(deleteErr) {
					if (deleteErr) return reply(new Error(deleteErr));
					return reply('ok');
				});
			});
		}
	}
};
