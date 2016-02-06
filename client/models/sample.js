var AmpModel = require('ampersand-model');

var SampleModel = AmpModel.extend({
	props: {
		id: 'string',
		name: 'string'
	},
	initialize: function(sampleData, options) {
		this.id = sampleData.id;
		this.name = sampleData.name;
	},
	url: function() {
		return '/api/sample/' + this.id;
	}
});

module.exports = SampleModel;
