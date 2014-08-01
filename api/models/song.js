var dulcimer = require('dulcimer');

var SongFactory = new dulcimer.Model({
	locked: {
		type: 'boolean'
	},
	rows: {
		foreignCollection: 'song-row'
	}
}, {
	name: 'song',
	keyType: 'uuid'
});

module.exports = SongFactory;
