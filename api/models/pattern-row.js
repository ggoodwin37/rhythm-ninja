var dulcimer = require('dulcimer');

var PatternRowFactory = new dulcimer.Model({
	poolEntry: {
		type: 'name'
	},
	steps: {
		type: 'array'
	}
}, {
	name: 'pattern-row',
	keyType: 'uuid'
});

module.exports = PatternRowFactory;
