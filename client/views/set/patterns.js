var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.set.patterns,
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.model.on('change:patterns', function() {
			self.render();
		});
	},
	render: function() {
		var patterns = (this.model && this.model.patterns) ? this.model.patterns : [];
		this.renderWithTemplate({patterns: patterns});
		this.setLoading(!patterns.length);
	},
	setLoading: function(isLoading) {
		if (isLoading) {
			dom.addClass(this.queryByHook('view-container'), 'default-loading');
		} else {
			dom.removeClass(this.queryByHook('view-container'), 'default-loading');
		}
	}
});
