var SetFactory = require('../models/set');
var PatternFactory = require('../models/pattern');
var PatternRowFactory = require('../models/pattern-row');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = function(app) {
	return {
		hasMany: [
			{
				rows: require('./pattern-has-rows')(app)
			}
		],
		show: function(request, reply) {
			var patternId = request.params.pattern_id;
			// TODO: validate set/authenticate
			PatternFactory.get(patternId, function(err, patternModel) {
				if (handlingError(err, reply)) return;
				return reply(patternModel.toJSON());
			});
		},
		create: function(request, reply) {
			var setName = request.params.set_id;
			var patternModel = PatternFactory.create(request.payload);
			patternModel.save(function(err) {
				if (handlingError(err, reply)) return;
				SetFactory.findByIndex('name', setName, function(err, setModel) {
					if (handlingError(err, reply)) return;
					var newPatterns = setModel.patterns.slice(0);
					newPatterns.push(patternModel);

					SetFactory.update(setModel.key, {patterns: newPatterns}, function(err, newModel) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new pattern: ' + patternModel.key);
						}

						reply(patternModel.toJSON());
					});
				});
			});
		},
		update: function(request, reply) {
			var setName = request.params.set_id;
			var patternId = request.params.pattern_id;
			var updatedPatternData = request.payload;
			PatternFactory.get(patternId, function(err, patternModel) {
				if (handlingError(err, reply)) return;
				// TODO: consider using extend pattern here instead
				var mergeObject = {};
				if (typeof updatedPatternData.name != 'undefined') {
					mergeObject['name'] = updatedPatternData.name;
				}
				if (typeof updatedPatternData.length != 'undefined') {
					mergeObject['length'] = updatedPatternData.length;
				}
				if (typeof updatedPatternData.locked != 'undefined') {
					mergeObject['locked'] = updatedPatternData.locked;
				}
				PatternFactory.update(patternModel.key, mergeObject, function(err, updatedModel) {
					if (handlingError(err, reply)) return;
					reply(updatedModel.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var setName = request.params.set_id;
			var patternId = request.params.pattern_id;

			async.series([
				function(callback) {
					// first check the set for any instances of this patternId
					SetFactory.findByIndex('name', setName, function(err, setModel) {
						if (handlingError(err, reply)) return callback();

						var newPatterns = setModel.patterns.slice(0).filter(function(thisPatternEl) {
							return thisPatternEl.key !== patternId;
						});

						SetFactory.update(setModel.key, {patterns: newPatterns}, function(err, newModel) {
							if (handlingError(err, reply)) return callback();
							callback();
						});
					});
				},
				function(callback) {
					// TODO: validate set/authenticate
					// TODO: need to explicitly delete patternRow children here?
					PatternFactory.get(patternId, function(err, patternModel) {
						if (handlingError(err, reply)) return callback();
						patternModel.delete(function(err) {
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
