var dulcimer = require('dulcimer');
var SongRowFactory = require('./song-row');

var SongFactory = new dulcimer.Model({
	test: require('./test-prop'),
	id: {
		derive: function() {
			return this.key;
		}
	},
	locked: {
		type: 'boolean',
		required: true,
		default: false
	},
	rows: {
		foreignCollection: SongRowFactory
	}
}, {
	name: 'song',
	keyType: 'uuid'
});

module.exports = SongFactory;
