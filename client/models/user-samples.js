var Model = require('ampersand-model');
var SampleCollection = require('./sample-collection');

var UserSamplesModel = Model.extend({
	props: {
		userId: 'string'
	},
	collections: {
		samples: SampleCollection
	},
	initialize: function(userId) {
		this.userId = userId;
	},
	url: function() {
		return '/api/userSamples/' + this.userId;
	}
});

module.exports = UserSamplesModel;
