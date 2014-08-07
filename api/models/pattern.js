var dulcimer = require('dulcimer');
var PatternRowFactory = require('./pattern-row');

var PatternFactory = new dulcimer.Model({
	id: {
		derive: function() {
			return this.key;
		}
	},
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
		foreignCollection: PatternRowFactory
	}
}, {
	name: 'pattern',
	keyType: 'uuid'
});

module.exports = PatternFactory;
