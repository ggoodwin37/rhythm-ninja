var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var handlingError = require('../handling-error');
var SetFactory = require('../models/set');
var SongFactory = require('../models/song');

function createSet(setName, reply) {
	var pool = [];
	var patterns = [];
	var songs = [];

	var setInstance = SetFactory.create({
		name: setName,
		swing: 0.5,
		bpm: 155,
		pool: pool,
		patterns: patterns,
		songs: songs
	});

	setInstance.save(function(err) {
		reply(setInstance.toJSON());
	});
}

module.exports = function(app) {
	return {
		hasMany: [
			{
				poolentry: require('./set-has-pool-entry')(app)
			},
			{
				pattern: require('./set-has-pattern')(app)
			},
			{
				song: require('./set-has-song')(app)
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
				if (typeof updatedData.swing != 'undefined') {
					mergeObject.swing = updatedData.swing;
				}
				if (typeof updatedData.bpm != 'undefined') {
					mergeObject.bpm = updatedData.bpm;
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
