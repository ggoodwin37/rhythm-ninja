var dulcimer = require('dulcimer');

var PatternRowFactory = new dulcimer.Model({
	poolEntry: {
		type: 'name',
		required: true,
		default: 'default'
	},
	steps: {
		type: 'array',
		required: true,
		default: [1, 2, 3]  // TODO: just playin
	}
}, {
	name: 'pattern-row',
	keyType: 'uuid'
});

module.exports = PatternRowFactory;
