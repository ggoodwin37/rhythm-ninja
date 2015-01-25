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
		var patterns = (this.model && this.model.patterns) ? this.model.patterns : null;
		this.renderWithTemplate({
			patterns: patterns,
			setName: this.model.name,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!patterns);
	},
	setLoading: function(isLoading) {
		var el = this.queryByHook('patterns-view-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	}
});
