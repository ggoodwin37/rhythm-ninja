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
	initialize: function(patternData) {
		this.patternId = patternData.id;
	},
	url: function() {
		var url = '/api/set/' + this.setName + '/pattern';
		if (this.patternId) {
			url += '/' + this.patternId;
		}
		return url;
	}
});

module.exports = PatternModel;
