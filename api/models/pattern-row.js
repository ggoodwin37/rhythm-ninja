var verymodel = require('verymodel');
var _ = require('underscore');

var PatternRowFactory = new verymodel.Model({
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
	// TODO: fix this for mongo
	steps: {
		type: 'array',
		required: true,
		default: function() {
			return [];
		},
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
