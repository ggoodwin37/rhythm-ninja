var AmpModel = require('ampersand-model');
var PatternRowsCollection = require('./pattern-rows-collection');

module.exports = AmpModel.extend({
    props: {
		name: 'string',
		locked: 'boolean',
		length: 'number'
	},
	collections: {
		rows: PatternRowsCollection
	},
	initialize: function() {
	}
});
