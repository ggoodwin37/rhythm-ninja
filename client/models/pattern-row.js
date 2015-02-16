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
		var url = 'pattern-row/' + this.patternRowId;
		console.log('patternRowModel url: ' + url);
		return url;
	}
});

module.exports = PatternRowModel;
