var dulcimer = require('dulcimer');

var PatternFactory = new dulcimer.Model({
	name: {
		type: 'string'
	},
	length: {
		type: 'integer'
	},
	locked: {
		type: 'boolean'
	},
	rows: {
		foreignCollection: 'pattern-row'
	}
}, {
	name: 'pattern',
	keyType: 'uuid'
});

module.exports = PatternFactory;
