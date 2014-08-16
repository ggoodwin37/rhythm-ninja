var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');
var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');
var StepList = require('../../step-list');

module.exports = function(app) {

	var SetModel = require('../models/set')(app);
	var PatternModel = require('../models/pattern')(app);
	var PatternRowModel = require('../models/pattern-row')(app);
	var PoolEntryModel = require('../models/pool-entry')(app);
	var SongModel = require('../models/song')(app);
	var SongRowModel = require('../models/song-row')(app);

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
			SetModel.findOne({name: setName})
				.populate('pool patterns songs')
				.exec(function(err, setModel) {
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
			SetModel.findOne({name: setName}, function(err, setModel) {
				if (handlingErrorOrMissing(err, setModel, reply)) return;  // handle 404 case

				var stepListDelete = new StepList();
				var stepListPattern = new StepList();
				var stepListSong = new StepList();

				setModel.pool.forEach(function(poolEntryId) {
					stepListDelete.addStep(function(cb) {
						PoolEntryModel.remove({_id: poolEntryId}, cb);
					});
				});

				// first generate all the delete steps for each song and each song's songrow
				setModel.songs.forEach(function(songId) {
					stepListSong.addStep(function(cb) {
						SongModel.findById(songId, function(err, songModel) {
							songModel.rows.forEach(function(songRowId) {
								stepListDelete.addStep(function(cb) {
									SongRowModel.remove({_id: songRowId}, cb);
								});
							});
							cb();
						});
					});
					stepListDelete.addStep(function(cb) {
						SongModel.remove({_id: songId}, cb);
					});
				});

				// after grabbing all songs and songrows (and generating delete steps for them), do patterns
				stepListSong.execute(function() {
					setModel.patterns.forEach(function(patternId) {
						stepListPattern.addStep(function(cb) {
							PatternModel.findById(patternId, function(err, patternModel) {
								patternModel.rows.forEach(function(patternRowId) {
									stepListDelete.addStep(function(cb) {
										PatternRowModel.remove({_id: patternRowId}, cb);
									});
								});
								cb();
							});
						});
						stepListDelete.addStep(function(cb) {
							PatternModel.remove({_id: patternId}, cb);
						});
					});

					// after iterating patterns and patternrows, add a delete step for set then execute all deletes
					stepListPattern.execute(function() {
						stepListDelete.addStep(function(cb) {
							SetModel.remove({name: setName}, function(err) {
								if (handlingError(err, reply)) return cb();
								cb();
							});
						});

						stepListDelete.execute(function() {
							reply();
						});
					});
				});
			});
		}
	};
};
