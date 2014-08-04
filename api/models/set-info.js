var dulcimer = require('dulcimer');

var SetInfoFactory = new dulcimer.Model({
	swing: {
		type: 'numeric',
		required: true,
		default: 0.5
	},
	bpm: {
		type: 'numeric',
		required: true,
		default: 110.0
	}
}, {
	name: 'set-info',
	keyType: 'uuid'
});

module.exports = SetInfoFactory;
