var dulcimer = require('dulcimer');

var SetInfoFactory = new dulcimer.Model({
	swing: {
		type: 'numeric'
	},
	bpm: {
		type: 'numeric'
	}
}, {
	name: 'set-info',
	keyType: 'uuid'
});

module.exports = SetInfoFactory;