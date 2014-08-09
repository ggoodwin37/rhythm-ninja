var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');

var handlingError = require('../handling-error');

var SetFactory = require('../models/set');
var PatternFactory = require('../models/pattern');
var PatternRowFactory = require('../models/pattern-row');

// alias
var parentFactory = SetFactory;
var itemFactory = PatternFactory;
var childFactory = PatternRowFactory;

module.exports = function(app) {
	return {
		hasMany: [
			{
				patternrow: require('./pattern-has-rows')(app)
			}
		],
		index: function(request, reply) {
			var parentId = request.params.set_id;
			parentFactory.findByIndex('name', parentId, function(err, parentModel) {
				if (handlingError(err, reply)) return;
				return reply(parentModel.patterns.map(function(thisPattern) { return thisPattern.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var itemId = request.params.pattern_id;
			itemFactory.get(itemId, function(err, itemModel) {
				if (handlingError(err, reply)) return;
				return reply(itemModel.toJSON());
			});
		},
		create: function(request, reply) {
			var parentId = request.params.set_id;
			var newModel = itemFactory.create(request.payload);
			newModel.save(function(err) {
				if (handlingError(err, reply)) return;
				parentFactory.findByIndex('name', parentId, function(err, parentModel) {
					if (handlingError(err, reply)) return;
					var newList = parentModel.patterns.slice(0);
					newList.push(newModel);

					parentFactory.update(parentModel.key, {patterns: newList}, function(err, updatedParentModel) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new pattern: ' + newModel.key);
						}

						reply(newModel.toJSON());
					});
				});
			});
		},
		update: function(request, reply) {
			var parentId = request.params.set_id;
			var itemId = request.params.pattern_id;
			itemFactory.get(itemId, function(err, itemModel) {
				if (handlingError(err, reply)) return;
				var mergeObject = _.pick(request.payload, 'name', 'length', 'locked', 'rows');
				itemFactory.update(itemModel.key, mergeObject, function(err, updatedModel) {
					if (handlingError(err, reply)) return;
					reply(updatedModel.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var parentId = request.params.set_id;
			var itemId = request.params.pattern_id;

			async.series([
				function(callback) {
					// first check the parent for any instances of this item and remove
					parentFactory.findByIndex('name', parentId, function(err, parentModel) {
						if (handlingError(err, reply)) return callback();

						var newList = parentModel.patterns.slice(0).filter(function(thisEl) {
							return thisEl.key !== itemId;
						});

						parentFactory.update(parentModel.key, {patterns: newList}, function(err, newParentModel) {
							if (handlingError(err, reply)) return callback();
							callback();
						});
					});
				},
				function(callback) {
					// then perform a delete on all children
					itemFactory.get(itemId, function(err, itemModel) {
						if (handlingError(err, reply)) return callback();
						itemModel.rows.forEach(function(thisChild) {
							childFactory.get(thisChild.key, function(err, childModel) {
								childModel.delete(function(err) {
									if (handlingError(err, reply)) return;
									callback();
								});
							});
						});
					});
				},
				function(callback) {
					itemFactory.get(itemId, function(err, itemModel) {
						if (handlingError(err, reply)) return callback();
						itemModel.delete(function(err) {
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
