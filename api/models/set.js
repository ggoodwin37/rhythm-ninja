var dulcimer = require('dulcimer');
var PoolEntryFactory = require('./pool-entry');
var PatternFactory = require('./pattern');
var SongFactory = require('./song');

var SetFactory = new dulcimer.Model({
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
	swing: {
		type: 'numeric',
		required: true,
		default: 0.5
	},
	bpm: {
		type: 'numeric',
		required: true,
		default: 110.0
	},
	pool: {
		foreignCollection: PoolEntryFactory
	},
	patterns: {
		foreignCollection: PatternFactory
	},
	songs: {
		foreignCollection: SongFactory
	}
}, {
	name: 'set',
	keyType: 'uuid'
});

module.exports = SetFactory;
