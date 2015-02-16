var AmpModel = require('ampersand-model');

var PatternRowModel = AmpModel.extend({
    props: {
		id: 'string',
		poolEntry: 'string',
		steps: 'array'
	},
	initialize: function(patternRowData) {
		// TODO: what's the least hacky way to get setName/patternId here?
		this.setName = 'NEED_SET_NAME';
		this.patternId = 'NEED_PATTERN_ID';
		this.patternRowId = patternRowData.id;
	},
	url: function() {
		var url = '/api/set/' + this.setName + '/pattern/' + this.patternId + '/patternrow';
		if (this.patternRowId) {
			url += '/' + this.patternRowId;
		}
		return url;
	}
});

module.exports = PatternRowModel;
