var Model = require('ampersand-model');

module.exports = Model.extend({
	url: function() {
		return window.app.config.apiUrlBase + '/test1';
	},
	props: {
		id: 'string',
		name: 'string'
	}
});
