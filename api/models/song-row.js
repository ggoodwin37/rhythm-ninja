var dulcimer = require('dulcimer');

var SongRowFactory = new dulcimer.Model({
	patternId: {
		type: 'string',
		required: true,
		default: 'default'
	},
	offset: {
		type: 'integer',
		required: true,
		default: 0
	},
	len: {
		type: 'integer',
		required: true,
		default: -1  // -> natural pattern length
	},
	count: {
		type: 'integer',
		required: true,
		default: 1
	}
}, {
	name: 'song-row',
	keyType: 'uuid'
});

module.exports = SongRowFactory;
