var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');

var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');
var StepList = require('../../step-list');
var treeUpdate = require('./tree-update');
var treeDelete = require('./tree-delete');

module.exports = function(app, opts) {

	var verifyAuth = require('./verify-auth')(app);

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
	var populateFields = opts.populateFields;

	return {
		show: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				var itemId = request.params[routeItemIdKey];
				var query = itemFactory.findById(itemId);
				if (populateFields) {
					query.populate(populateFields);
				}
				var execQuery = function() {
					query.exec(function(err, itemModel) {
						if (handlingErrorOrMissing(err, itemModel, reply)) return;
						return reply(itemModel.toJSON());
					});
				}
				var fakeDelayMs = 0;
				if (app.config.fakeDelayOnGetMs > 0) {
					setTimeout(execQuery, app.config.fakeDelayOnGetMs);
				} else {
					execQuery();
				}
			},
			config: {
				auth: app.authConfig
			}
		},
		create: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				var parentId = request.params[routeParentIdKey],
					newModel;
				function createAndSaveNewModel(cb) {
					var newData = _.extend({parent_id: parentId}, request.payload);
					newModel = new itemFactory(newData);
					newModel.save(function(err, newModelResult) {
						if (handlingError(err, reply)) return;
						cb(null, newModelResult.id);
					});
				}
				function updateParentModelCollection(newModelId, cb) {
					var parentQuery = {};
					parentQuery[parentQueryField] = parentId;
					parentFactory.findOne(parentQuery, function(err, parentModel) {
						if (handlingError(err, reply)) return;
						parentModel[parentCollection].push(newModelId);
						parentModel.save(function(err, parentModel) {
							if (handlingError(err, reply)) return;
							cb(null);
						});
					});
				}
				async.waterfall([createAndSaveNewModel, updateParentModelCollection], function(err) {
					if (handlingError(err, reply)) return;
					reply(newModel.toJSON());
				});
			},
			config: {
				auth: app.authConfig
			}
		},
		update: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				var itemId = request.params[routeItemIdKey] || null
				treeUpdate(opts, itemId, request.payload, reply);
			},
			config: {
				auth: app.authConfig
			}
		},
		destroy: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				var parentId = request.params[routeParentIdKey];
				var itemId = request.params[routeItemIdKey];
				itemFactory.findById(itemId, function(err, itemModel) {  // make sure it exists
					if (handlingErrorOrMissing(err, itemModel, reply)) return;
					treeDelete(itemModel, opts, reply, function(err) {
						if (handlingError(err, reply)) return;
						reply();
					});
				});
			},
			config: {
				auth: app.authConfig
			}
		}
	};
};
