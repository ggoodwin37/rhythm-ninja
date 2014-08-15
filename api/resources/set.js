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

		setInstance.save(function(err, setInstance, numAffected) {
			done(err, setInstance);
		});
	}

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
		show: function(request, reply) {
			var setName = request.params.set_id;
			SetModel.findOne({name: setName}, function(err, setModel) {
				var shouldCreate = false;

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
			var setName = request.params.set_id;
			var updatedData = request.payload;
			SetModel.update({name: setName}, updatedData, function(err, numUpdated) {
				if (handlingErrorOrMissing(err, numUpdated, reply)) return;
				return reply();
			});
		},
		destroy: function(request, reply) {
			var setName = request.params.set_id;
			SetModel.findOne({name: setName}, function(err, doc) {
				if (handlingErrorOrMissing(err, doc, reply)) return;  // handle 404 case

				SetModel.remove({name: setName}, function(err) {
					if (handlingError(err, reply)) return;
					reply();
				});
			});

			// TODO: rewrite
			// SetModel.findOne({name: setName}, function(err, setModel) {
			// 	if (handlingErrorOrMissing(err, setModel, reply)) return;

			// 	var stepList = new StepList();

			// 	delete all poolEntries
			// 	setModel.pool.forEach(function(thisModel) {
			// 		stepList.addStep(function(callback) {
			// 			thisModel.delete(function(err) {
			// 				if (handlingError(err, reply)) return;
			// 				callback();
			// 			});
			// 		});
			// 	});

			// 	delete all patterns and their child rows
			// 	setModel.patterns.forEach(function(thisModel) {
			// 		thisModel.rows.forEach(function(thisChild) {
			// 			stepList.addStep(function(callback) {
			// 				thisChild.delete(function(err) {
			// 					if (handlingError(err, reply)) return;
			// 					callback();
			// 				});
			// 			});
			// 		});
			// 		stepList.addStep(function(callback) {
			// 			thisModel.delete(function(err) {
			// 				if (handlingError(err, reply)) return;
			// 				callback();
			// 			});
			// 		});
			// 	});

			// 	delete all songs and their child rows
			// 	setModel.songs.forEach(function(thisModel) {
			// 		thisModel.rows.forEach(function(thisChild) {
			// 			stepList.addStep(function(callback) {
			// 				thisChild.delete(function(err) {
			// 					if (handlingError(err, reply)) return;
			// 					callback();
			// 				});
			// 			});
			// 		});
			// 		stepList.addStep(function(callback) {
			// 			thisModel.delete(function(err) {
			// 				if (handlingError(err, reply)) return;
			// 				callback();
			// 			});
			// 		});
			// 	});

			// 	// finally, delete the set itself
			// 	stepList.addStep(function(callback) {
			// 		SetModel.delete(function(err) {
			// 			if (handlingError(err, reply)) return;
			// 			callback();
			// 		});
			// 	});
			// 	stepList.execute(function() {
			// 		reply();
			// 	});
			// });
		}
	};
};
