var dulcimer = require('dulcimer');

var SongRowFactory = new dulcimer.Model({
	// TODO: this is conceptually a 'weak' ref, should I still use a foreignkey here?
	pattern: {
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
		type: 'integer'
		required: true,
		default: -1  // -> natural pattern length
	},
	count: {
		type: 'integer'
		required: true,
		default: 1
	}
}, {
	name: 'song-row',
	keyType: 'uuid'
});

module.exports = SongRowFactory;
