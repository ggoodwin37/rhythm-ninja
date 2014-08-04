var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var handlingError = require('../handling-error');
var SetFactory = require('../models/set.js');
var SongFactory = require('../models/song.js');

module.exports = {
	hasMany: [
		{
			rows: require('./song-has-rows.js')
		}
	],
	show: {
		handler: function(request, reply) {
			var setName = request.params.setSong_id;
			SetFactory.findByIndex('name', setName, function(err, setModel) {
				if (handlingError(err, reply)) return;
				reply(setModel.song);
			});
		}
	},
	update: {
		handler: function(request, reply) {
			var setName = request.params.setSong_id;
			var updatedSongData = request.payload;
			SetFactory.findByIndex('name', setName, function(err, setModel) {
				var songModel = setModel.song;
				var mergeObject = {};
				if (typeof updatedSongData.locked != 'undefined') {
					mergeObject.locked = updatedSongData.locked;
				}
				SongFactory.update(songModel.key, mergeObject, function(err, result) {
					if (handlingError(err, reply)) return;
					reply(result);
				});
			});
		}
	}
};
