var dulcimer = require('dulcimer');

var PatternFactory = new dulcimer.Model({
	name: {
		type: 'string',
		required: true,
		default: 'default'
	},
	length: {
		type: 'integer',
		required: true,
		default: 16
	},
	locked: {
		type: 'boolean',
		required: true,
		default: false
	},
	rows: {
		foreignCollection: 'pattern-row'
	}
}, {
	name: 'pattern',
	keyType: 'uuid'
});

module.exports = PatternFactory;
