var SetFactory = require('../models/set');
var SongFactory = require('../models/song');
var SongRowFactory = require('../models/song-row');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = {
	show: function(request, reply) {
		var rowId = request.params.row_id;
		// TODO: validate set/authenticate
		SongRowFactory.get(rowId, function(err, songRowModel) {
			if (handlingError(err, reply)) return;
			return reply(songRowModel);
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
				var newRows = setModel.songs.rows.slice(0);
				newRows.push(rowModel);
				SongFactory.update(setModel.song.key, {rows: newRows}, function(err, result) {
					if (handlingError(err, reply)) return;
					reply(rowModel);
				});
			});
		})
	},
	update: function(request, reply) {
		var rowId = request.params.row_id;
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
				reply(updatedModel);
			});
		});
	},
	destroy: function(request, reply) {
		var setName = request.params.setSong_id;
		var rowId = request.params.row_id;
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
};
