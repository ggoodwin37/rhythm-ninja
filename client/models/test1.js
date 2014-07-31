var Model = require('ampersand-model');

module.exports = Model.extend({
	urlRoot: window.app.config.apiUrlBase + '/test1',
	props: {
		id: 'string',
		name: 'string'
	}
});
