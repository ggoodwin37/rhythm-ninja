var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var SetFactory = require('../models/set');
var SetInfoFactory = require('../models/set-info');
var SongFactory = require('../models/song');
var PoolEntryFactory = require('../models/pool-entry');
var PatternFactory = require('../models/pattern');

function createSet(setName, reply) {
	var setInfo = SetInfoFactory.create();
	var pool = [];
	var patterns = [];
	var song = SongFactory.create();

	var setInstance = SetFactory.create({
		name: setName,
		setInfo: setInfo,
		pool: pool,
		patterns: patterns,
		song: song
	});

	// need to save each foreign object separately.
	async.series([
		function(callback) { setInfo.save(callback); },
		function(callback) { song.save(callback); },
		function(callback) { setInstance.save(callback); }
	], function(err, results) {
		reply(setInstance);
	});
}

module.exports = {
	// TODO: require these in
	hasMany: [
		{
			poolEntry: {
				show: function(request, reply) {
					return reply('nyi');
				},
				create: function(request, reply) {
					return reply('nyi');
				},
				destroy: function(request, reply) {
					return reply('nyi');
				}
			}
		},
		{
			pattern: {
				show: function(request, reply) {
					return reply('nyi');
				},
				create: function(request, reply) {
					return reply('nyi');
				},
				destroy: function(request, reply) {
					return reply('nyi');
				}
			}
		}
	],
	show: {
		handler: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						console.log('lazy creating set with name: ' + setName);
						return createSet(setName, reply);
					}
					return reply(new Error(err));
				}
				reply(result);
			});
		}
	},
	update: {
		handler: function(request, reply) {
			// TODO: does this handle updating children as well?
			var setName = request.params.set_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
				if (err) {
					if (err.type == 'NotFoundError') {
						return reply().code(404);
					} else {
						return reply(new Error(err));
					}
				}
				SetFactory.update(result.key, request.payload, function(updateErr, updateResult) {
					if (updateErr) return reply(new Error(updateErr));
					return reply(updateResult);
				});
			});
		}
	},
	destroy: {
		handler: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
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
