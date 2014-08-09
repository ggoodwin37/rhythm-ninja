var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');
var _ = require('underscore');

var handlingError = require('../handling-error');

var SetFactory = require('../models/set');
var SongFactory = require('../models/song');
var SongRowFactory = require('../models/song-row');

// alias
var parentFactory = SetFactory;
var itemFactory = SongFactory;
var childFactory = SongRowFactory;

module.exports = function(app) {
	return {
		hasMany: [
			{
				songrow: require('./song-has-song-rows.js')(app)
			}
		],
		index: function(request, reply) {
			var parentId = request.params.set_id;
			parentFactory.get(parentId, function(err, parentModel) {
				if (handlingError(err, reply)) return;
				return reply(parentModel.songs.map(function(thisPattern) { return thisPattern.toJSON(); });
			});
		},
		show: function(request, reply) {
			var itemId = request.params.song_id;
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
				parentFactory.get(parentId, function(err, parentModel) {
					if (handlingError(err, reply)) return;
					var newList = parentModel.songs.slice(0);
					newList.push(newModel);

					parentFactory.update(parentModel.key, {songs: newList}, function(err, updatedParentModel) {
						if (handlingError(err, reply)) return;

						if (app.config.logThings['api--create-stuff']) {
							console.log('created a new song: ' + newModel.key);
						}

						reply(newModel.toJSON());
					});
				});
			});
		},
		update: function(request, reply) {
			var parentId = request.params.set_id;
			var itemId = request.params.song_id;
			itemFactory.get(itemId, function(err, itemModel) {
				if (handlingError(err, reply)) return;
				var mergeObject = _.pick(request.payload, 'name', 'locked', 'rows');
				itemFactory.update(itemModel.key, mergeObject, function(err, updatedModel) {
					if (handlingError(err, reply)) return;
					reply(updatedModel.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var parentId = request.params.set_id;
			var itemId = request.params.song_id;

			async.series([
				function(callback) {
					// first check the parent for any instances of this item and remove
					parentFactory.get(parentId, function(err, parentModel) {
						if (handlingError(err, reply)) return callback();

						var newList = parentModel.songs.slice(0).filter(function(thisEl) {
							return thisEl.key !== itemId;
						});

						parentFactory.update(parentModel.key, {songs: newList}, function(err, newParentModel) {
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
