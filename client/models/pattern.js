var AmpModel = require('ampersand-model');
var PatternRowsCollection = require('./pattern-rows-collection');

var PatternModel = AmpModel.extend({
    props: {
		id: 'string',
		name: 'string',
		locked: 'boolean',
		length: 'number'
	},
	collections: {
		rows: PatternRowsCollection
	},
	initialize: function(patternModel) {
		this.setName = 'HUH';
	},
	urlRoot: function() {
		var urlRoot = '/api/set/' + this.setName + '/pattern';
		console.log('patternModel urlRoot: ' + urlRoot);
		return urlRoot;
	}
});

module.exports = PatternModel;
