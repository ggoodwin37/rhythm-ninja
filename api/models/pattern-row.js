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
		default: []
	}
}, {
	name: 'pattern-row',
	keyType: 'uuid'
});

module.exports = PatternRowFactory;
