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
		var patterns;
		if (this.model && this.model.patterns) {
			this.setLoading(false);
			patterns = this.model.patterns;
		} else {
			this.setLoading(true);
			patterns = [];
		}
		this.renderWithTemplate({patterns: patterns});
	},
	setLoading: function(isLoading) {
		if (isLoading) {
			dom.addClass(this.el, 'default-loading');
		} else {
			dom.removeClass(this.el, 'default-loading');
		}
	}
});
