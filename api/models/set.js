var dulcimer = require('dulcimer');
var SetInfoFactory = require('./set-info');
var PoolEntryFactory = require('./pool-entry');
var PatternFactory = require('./pattern');
var SongFactory = require('./song');

var SetFactory = new dulcimer.Model({
	name: {
		type: 'string',
		index: true,
		required: true,
		default: 'default'
	},
	setInfo: {
		foreignKey: SetInfoFactory
	},
	pool: {
		foreignCollection: PoolEntryFactory
	},
	patterns: {
		foreignCollection: PatternFactory
	},
	song: {
		foreignKey: SongFactory
	}
}, {
	name: 'set',
	keyType: 'uuid'
});

module.exports = SetFactory;
