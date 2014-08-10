var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');

var handlingError = require('../handling-error');

var SongFactory = require('../models/song');
var SongRowFactory = require('../models/song-row');

// alias
var parentFactory = SongFactory;
var itemFactory = SongRowFactory;

module.exports = function(app) {
	return {
		index: function(request, reply) {
			var parentId = request.params.song_id;
			parentFactory.get(parentId, function(err, parentModel) {
				if (handlingError(err, reply)) return;
				return reply(parentModel.rows.map(function(thisRow) { return thisRow.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var itemId = request.params.songrow_id;
			itemFactory.get(itemId, function(err, itemModel) {
				if (handlingError(err, reply)) return;
				return reply(itemModel.toJSON());
			});
		},
		create: function(request, reply) {
			var parentId = request.params.song_id;
			var newModel = itemFactory.create(request.payload);
			newModel.save(function(err) {
				if (handlingError(err, reply)) return;
				parentFactory.get(parentId, function(err, parentModel) {
					if (handlingError(err, reply)) return;
					var newList = parentModel.rows.slice(0);
					newList.push(newModel);

					parentFactory.update(parentModel.key, {rows: newList}, function(err, updatedParentModel) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new songRow: ' + newModel.key);
						}

						reply(newModel.toJSON());
					});
				});
			});
		},
		update: function(request, reply) {
			var parentId = request.params.song_id;
			var itemId = request.params.songrow_id;
			itemFactory.get(itemId, function(err, itemModel) {
				if (handlingError(err, reply)) return;
				var mergeObject = _.pick(request.payload, 'patternId', 'offset', 'len', 'count');
				itemFactory.update(itemModel.key, mergeObject, function(err, updatedModel) {
					if (handlingError(err, reply)) return;
					reply(updatedModel.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var parentId = request.params.song_id;
			var itemId = request.params.songrow_id;

			async.series([
				function(callback) {
					// first check the parent for any instances of this item and remove
					parentFactory.get(parentId, function(err, parentModel) {
						if (handlingError(err, reply)) return callback();

						var newList = parentModel.rows.slice(0).filter(function(thisEl) {
							return thisEl.key !== itemId;
						});

						parentFactory.update(parentModel.key, {rows: newList}, function(err, newParentModel) {
							if (handlingError(err, reply)) return callback();
							callback();
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
