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
				return reply(parentModel.rows.map(function(thisRow) { return thisRow.toJSON(); });
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






var SetFactory = require('../models/set');
var SongFactory = require('../models/song');
var SongRowFactory = require('../models/song-row');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = function(app) {
	return {
		index: function(request, reply) {
			SongRowFactory.all(function(err, models, pagination) {
				if (handlingError(err, reply)) return;
				reply(models.map(function(model) { return model.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var rowId = request.params.songRow_id;
			// TODO: validate set/authenticate
			SongRowFactory.get(rowId, function(err, songRowModel) {
				if (handlingError(err, reply)) return;
				return reply(songRowModel.toJSON());
			});
		},
		create: function(request, reply) {
			var setName = request.params.setSong_id;
			var rowData = request.payload;
			var rowModel = SongRowFactory.create(rowData);
			rowModel.save(function(err) {
				if (handlingError(err, reply)) return;
				SetFactory.findByIndex('name', setName, function(err, setModel) {
					if (handlingError(err, reply)) return;
					var newRows = setModel.song.rows.slice(0);
					newRows.push(rowModel);
					SongFactory.update(setModel.song.key, {rows: newRows}, function(err, result) {
						if (handlingError(err, reply)) return;
						reply(rowModel.toJSON());
					});
				});
			})
		},
		update: function(request, reply) {
			var rowId = request.params.songRow_id;
			var updatedRowData = request.payload;
			SongRowFactory.get(rowId, function(err, rowModel) {
				if (handlingError(err, reply)) return;
				var mergeObject = {};
				if (typeof updatedRowData.patternId != 'undefined') {
					mergeObject.patternId = updatedRowData.patternId;
				}
				if (typeof updatedRowData.offset != 'undefined') {
					mergeObject.offset = updatedRowData.offset;
				}
				if (typeof updatedRowData.len != 'undefined') {
					mergeObject.len = updatedRowData.len;
				}
				if (typeof updatedRowData.count != 'undefined') {
					mergeObject.count = updatedRowData.count;
				}
				SongRowFactory.update(rowModel.key, mergeObject, function(err, updatedModel) {
					if (handlingError(err, reply)) return;
					reply(updatedModel.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var setName = request.params.setSong_id;
			var rowId = request.params.songRow_id;
			async.series([
				function(callback) {
					// first check the song for any instances of this rowId
					SetFactory.findByIndex('name', setName, function(err, setModel) {
						if (handlingError(err, reply)) return callback();

						var newRows = setModel.song.rows.slice(0).filter(function(thisRowEl) {
							return thisRowEl.key !== rowId;
						});

						SongFactory.update(setModel.song.key, {rows: newRows}, function(err, newModel) {
							if (handlingError(err, reply)) return callback();
							callback();
						});
					});
				},
				function(callback) {
					// TODO: validate set/authenticate
					SongRowFactory.get(rowId, function(err, rowModel) {
						if (handlingError(err, reply)) return callback();
						rowModel.delete(function(err) {
							if (handlingError(err, reply)) return;
							callback();
						});
					});
				}
			], function() {
				reply();
			});
		}
	}
};
