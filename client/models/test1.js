var Model = require('ampersand-model');

module.exports = Model.extend({
	url: function() {
		// pass a dummy id so we match API route.
		// mudskipper wants this by default, there may be a way to change this. but we'll need an id anyways.
		return window.app.config.apiUrlBase + '/test1/dummy-id';
	},
	props: {
		id: 'string',
		name: 'string'
	}
});
