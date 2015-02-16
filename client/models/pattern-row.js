var AmpModel = require('ampersand-model');

var PatternRowModel = AmpModel.extend({
    props: {
		id: 'string',
		poolEntry: 'string',
		steps: 'array'
	},
	initialize: function(patternRowData, options) {
		// need to figure out a better way to get arbitrary data in here.
		// in the case where this model is created via a call to rowCollection.create,
		// we can specify setName/patternId. But in the case where a pattern-row is loaded
		// as part of a set model from db, this is called by ampersand-model so we don't
		// pass anything in (but luckily we don't need it in that case).
		this.setName = options.setName || null;
		this.patternId = options.patternId || null;
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
