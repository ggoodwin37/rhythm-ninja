var AmpModel = require('ampersand-model');

var PatternRowModel = AmpModel.extend({
    props: {
		id: 'string',
		poolEntry: 'string',
		steps: 'array'
	},
	initialize: function(patternRowData) {
		this.patternRowId = patternRowData.id;
	},
	url: function() {
		var url = this.patternRowId;
		return url;
	}
});

module.exports = PatternRowModel;
