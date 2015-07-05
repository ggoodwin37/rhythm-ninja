var View = require('ampersand-view');
var templates = require('../templates');

module.exports = View.extend({
	template: templates.pages.pool(),
	initialize: function(params) {
		var self = this;

		this.params = params || {};

		this.model = window.app.getCachedSetModel(this.params.setName);  // TODO: get rid of global ref, pass in app.
		this.model.on('model-loaded', function(model) {
			if (self.stepGridSubview) self.stepGridSubview.model = model;
			self.model = model;
		});
	},
	render: function() {
		var self = this;
		this.renderWithTemplate();

		this.model.fetch({
			success: function(model, response) {
				// kind of weird that this can succeed even if response is not json.
				console.log('pool model fetch success: ' + JSON.stringify(response));
				console.log('  id is: ' + self.id);
			},
			error: function(model, response, options) {
				console.log('pool model fetch error. response: ' + JSON.stringify(response));
			}
		});

	}
});
