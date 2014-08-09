var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var handlingError = require('../handling-error');
var SetFactory = require('../models/set');
var SetInfoFactory = require('../models/set-info');
var SongFactory = require('../models/song');

function createSet(setName, reply) {
	var setInfo = SetInfoFactory.create({swing:0.5, bpm: 122});
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
		reply(setInstance.toJSON());
	});
}

module.exports = function(app) {
	return {
		hasOne: [
			{
				'set-info': require('./set-has-set-info')(app)
			},
			{
				'song': require('./set-has-song')(app)
			}
		],
		hasMany: [
			{
				'pool-entry': require('./set-has-pool-entry')(app)
			},
			{
				'pattern': require('./set-has-pattern')(app)
			}
		],
		index: function(request, reply) {
			SetFactory.all(function(err, models, pagination) {
				if (handlingError(err, reply)) return;
				reply(models.map(function(model) { return model.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.findByIndex('name', setName, function(err, setModel) {
				if (err) {
					if (err.type == 'NotFoundError') {

						if (app.config.logThings['api--create-stuff']) {
							console.log('lazy creating set with name: ' + setName);
						}

						return createSet(setName, reply);
					}
					return reply(new Error(err));
				}
				reply(setModel.toJSON());
			});
		},
		update: function(request, reply) {
			// note: this does not handle updating foreigns, should do that via each foreign's dedicated endpoint.
			var setName = request.params.set_id;
			var updatedData = request.payload;
			SetFactory.findByIndex('name', setName, function(err, setModel) {
				if (handlingError(err, reply)) return;
				var mergeObject = {};
				if (typeof updatedData.name != 'undefined') {
					mergeObject.name = updatedData.name;
				}
				SetFactory.update(setModel.key, mergeObject, function(updateErr, updateResult) {
					if (updateErr) return reply(new Error(updateErr));
					return reply(updateResult.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var setName = request.params.set_id;
			SetFactory.findByIndex('name', setName, function(err, result) {
				if (handlingError(err, reply)) return;
				result['delete'](function(deleteErr) {
					if (deleteErr) return reply(new Error(deleteErr));
					return reply('ok');
				});
			});
		}
	};
};
