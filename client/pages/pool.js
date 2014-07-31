var View = require('ampersand-view');
var templates = require('../templates');
var Test1View = require('../views/test1');

module.exports = View.extend({
	template: templates.pages.pool(),
	render: function() {
		var self = this;
		this.renderWithTemplate();

		this.model.fetch({
			success: function(model, response) {
				// kind of weird that this can succeed even if response is not json.
				console.log('pool model fetch success: ' + JSON.stringify(response));
				console.log('  id is: ' + self.id);
				self.renderSubview(new Test1View({
					model: self.model
				}), '[role=test1]');
			},
			error: function(model, response, options) {
				console.log('pool model fetch error. response: ' + JSON.stringify(response));
			}
		});

	}
});
