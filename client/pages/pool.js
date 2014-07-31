var View = require('ampersand-view');
var templates = require('../templates');
var Test1View = require('../views/test1');

module.exports = View.extend({
	template: templates.pages.pool(),
	render: function() {
		this.renderWithTemplate();

		this.model.fetch({
			success: function() {
				console.log('pool model fetch success');
				this.renderSubview(new Test1View({
					model: self.model
				}), '[role=test1]');
			},
			error: function(model, response, options) {
				console.log('pool model fetch error. response: ' + JSON.stringify(response);
			}
		});

	}
});
