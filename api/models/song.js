var verymodel = require('verymodel');
var SongRowFactory = require('./song-row');

var SongFactory = new verymodel.Model({
	id: {
		derive: function() {
			return this.key;
		}
	},
	name: {
		type: 'string',
		index: true,
		required: true,
		default: 'default'
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
