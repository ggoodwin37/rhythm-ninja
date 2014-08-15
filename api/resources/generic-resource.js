var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var _ = require('underscore');

var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');
var StepList = require('../../step-list');

module.exports = function(app, opts) {

	// alias into options
	var parentQueryField = opts.parentQueryField;
	var itemTypeName = opts.itemTypeName;
	var parentFactory = opts.parentFactory;
	var itemFactory = opts.itemFactory;
	var childFactory = opts.childFactory;
	var parentCollection = opts.parentCollection;
	var routeParentIdKey = opts.routeParentIdKey;
	var routeItemIdKey = opts.routeItemIdKey;
	var updateFields = opts.updateFields;

	return {
		show: function(request, reply) {
			var itemId = request.params[routeItemIdKey];
			itemFactory.findById(itemId, function(err, itemModel) {
				if (handlingErrorOrMissing(err, itemModel, reply)) return;
				return reply(itemModel.toJSON());
			});
		},
		create: function(request, reply) {
			var parentId = request.params[routeParentIdKey];

			var parentQuery = {};
			parentQuery[parentQueryField] = parentId;
			parentFactory.findOne(parentQuery, function(err, parentModel) {
				var newModel = new itemFactory(_.extend({parent_id: parentModel.id}, request.payload));
				newModel.save(function(err, newModel, numAffected) {
					if (handlingErrorOrMissing(err, numAffected, reply)) return;

					// update the parent's collection with our new id.
					var newParentCollection = parentModel[parentCollection].slice();
					newParentCollection.push(newModel.id);

					var updateData = {};
					updateData[parentCollection] = newParentCollection;

					parentModel.update(updateData, function(err) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new ' + itemTypeName + ' with id ' + newModel.id);
						}

						reply(newModel.toJSON());
					});
				});
			});
		},
		update: function(request, reply) {
			var itemId = request.params[routeItemIdKey];
			itemFactory.findById(itemId, function(err, itemModel) {
				if (handlingErrorOrMissing(err, itemModel, reply)) return;
				var args = [request.payload].concat(updateFields)
				var mergeObject = _.pick.apply(null, args);
inspect(mergeObject);
				itemModel.update(mergeObject, function(err) {
					if (handlingError(err, reply)) return;
					reply();
				});
			});
		},
		destroy: function(request, reply) {
			var parentId = request.params[routeParentIdKey];
			var itemId = request.params[routeItemIdKey];
			itemFactory.remove({id: itemId}, function(err) {
				if (handlingError(err, reply)) return;
				reply();
			});
			// TODO: tree logic, consume childFactory, etc.
		}
	};
};
