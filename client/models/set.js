var AmpModel = require('ampersand-model');
var PatternCollection = require('./pattern-collection');

var SetModel = AmpModel.extend({
	props: {
		id: 'string',
		bpm: 'number',
		name: 'string',
		pool: 'array',
		songs: 'array',  // TODO: extract collection
		swing: 'number'
	},
	collections: {
		patterns: PatternCollection
	},
	initialize: function(setName) {
		this.setName = setName;
	},
	url: function() {
		return '/api/set/' + this.setName;
	}
});

module.exports = SetModel;
