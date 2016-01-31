var AmpModel = require('ampersand-model');

var SampleModel = AmpModel.extend({
	props: {
		id: 'string',
		name: 'string'
	},
	initialize: function(id, name) {
		this.id = id;
		this.name = name;
	},
	url: function() {
		return '/api/sample/' + this.id;
	}
});

module.exports = SampleModel;
