var dulcimer = require('dulcimer');

var SongRowFactory = new dulcimer.Model({
	pattern: {
		type: 'string'
	},
	offset: {
		type: 'integer'
	},
	len: {
		type: 'integer'
	},
	count: {
		type: 'integer'
	}
}, {
	name: 'song-row',
	keyType: 'uuid'
});

module.exports = SongRowFactory;
