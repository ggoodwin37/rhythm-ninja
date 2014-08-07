var dulcimer = require('dulcimer');
var _ = require('underscore');

var PatternRowFactory = new dulcimer.Model({
	testFlag: require('./testFlag-prop'),
	id: {
		derive: function() {
			return this.key;
		}
	},
	poolEntry: {
		type: 'string',
		required: true,
		default: 'default'
	},
	steps: {
		type: 'array',
		required: true,
		default: function() {
			return [];
		},
		// note: dulcimer is doing something strange with array values, wrapping them in another array.
		//  counteract this with a flatten call when setting this property.
		processIn: function(inValue) {
			return _.flatten(inValue);
		},
		onSet: function(inValue) {
			return _.flatten(inValue);
		}
	}
}, {
	name: 'pattern-row',
	keyType: 'uuid'
});

module.exports = PatternRowFactory;
