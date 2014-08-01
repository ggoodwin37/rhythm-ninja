var dulcimer = require('dulcimer');

var SetFactory = new dulcimer.Model({
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
