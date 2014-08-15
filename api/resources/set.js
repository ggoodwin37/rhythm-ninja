var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');
var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');
var StepList = require('../../step-list');
var SetModel = require('../models/set');

module.exports = function(app) {

	function createSet(setName, done) {
		if (app.config.logThings['api--create-stuff']) {
			console.log('lazy creating set with name: ' + setName);
		}

		var pool = [];
		var patterns = [];
		var songs = [];

		var setInstance = new SetModel({
			name: setName,
			swing: 0.5,
			bpm: 155,
			pool: pool,
			patterns: patterns,
			songs: songs
		});

		setInstance.save(function(err) {
			done(err, setInstance);
		});
	}

	return {
		// hasMany: [
		// 	{
		// 		poolentry: require('./set-has-pool-entry')(app)
		// 	},
		// 	{
		// 		pattern: require('./set-has-pattern')(app)
		// 	},
		// 	{
		// 		song: require('./set-has-song')(app)
		// 	}
		// ],
		show: function(request, reply) {
			var setName = request.params.set_id;
			SetModel.find({name: setName}, function(err, setModel) {
				var shouldCreate = false;
				if (err) {
					inspect(err);
					return reply(new Error(err));
				}

				if (err) {
					if (err.type == 'NotFoundError') {
						shouldCreate = true;
					} else {
						return reply(new Error(err));
					}
				}
				if (!setModel) {
					shouldCreate = true;
				}
				if (shouldCreate) {
					return createSet(setName, function(err, instance) {
						reply(instance.toJSON());
					});
				}

				reply(setModel.toJSON());
			});
		},
		update: function(request, reply) {
			// note: this does not handle updating foreigns, should do that via each foreign's dedicated endpoint.
			var setName = request.params.set_id;
			var updatedData = request.payload;
			SetModel.find({name: setName}, function(err, setModel) {
				if (handlingErrorOrMissing(err, setModel, reply)) return;
				var mergeObject = _.pick(request.payload, 'name', 'swing', 'bpm');
				SetModel.update(setModel.key, mergeObject, function(updateErr, updateResult) {
					if (updateErr) return reply(new Error(updateErr));
					return reply(updateResult.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var setName = request.params.set_id;
			SetModel.find({name: setName}, function(err, setModel) {
				console.log('<<<<<<<< setModel:');
				inspect(setModel);
				console.log('<<<<<<<< err:');
				inspect(err);

				if (handlingErrorOrMissing(err, setModel, reply)) return;

				var stepList = new StepList();

				// delete all poolEntries
				setModel.pool.forEach(function(thisModel) {
					stepList.addStep(function(callback) {
						thisModel.delete(function(err) {
							if (handlingError(err, reply)) return;
							callback();
						});
					});
				});

				// delete all patterns and their child rows
				setModel.patterns.forEach(function(thisModel) {
					thisModel.rows.forEach(function(thisChild) {
						stepList.addStep(function(callback) {
							thisChild.delete(function(err) {
								if (handlingError(err, reply)) return;
								callback();
							});
						});
					});
					stepList.addStep(function(callback) {
						thisModel.delete(function(err) {
							if (handlingError(err, reply)) return;
							callback();
						});
					});
				});

				// delete all songs and their child rows
				setModel.songs.forEach(function(thisModel) {
					thisModel.rows.forEach(function(thisChild) {
						stepList.addStep(function(callback) {
							thisChild.delete(function(err) {
								if (handlingError(err, reply)) return;
								callback();
							});
						});
					});
					stepList.addStep(function(callback) {
						thisModel.delete(function(err) {
							if (handlingError(err, reply)) return;
							callback();
						});
					});
				});

				// finally, delete the set itself
				stepList.addStep(function(callback) {
					setModel.delete(function(err) {
						if (handlingError(err, reply)) return;
						callback();
					});
				});
				stepList.execute(function() {
					reply();
				});
			});
		}
	};
};
