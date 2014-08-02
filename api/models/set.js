var dulcimer = require('dulcimer');

var SetFactory = new dulcimer.Model({
	name: {
		type: 'string',
		index: true
	},
	setInfo: {
		foreignKey: 'set-info'
	},
	pool: {
		foreignCollection: 'pool-entry'
	},
	patterns: {
		foreignCollection: 'pattern'
	},
	song: {
		foreignKey: 'song'
	}
}, {
	name: 'set',
	keyType: 'uuid'
});

module.exports = SetFactory;
