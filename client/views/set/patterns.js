var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.set.patterns,
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.model.on('change:patterns', function() {
			// TODO: make sure this isn't firing too often once we have pattern editing.
			console.log('set pattern view: rerendering on model patterns change.');
			self.render();
		}).on('model-loaded', function() {
			console.log('set pattern view: rerendering on model load.');
			self.render();
		});
	},
	render: function() {
		var patternsCollection = (this.model && this.model.patterns) ? this.model.patterns : null;
		this.renderWithTemplate({
			patterns: patternsCollection.models || null,
			setName: this.model.name,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!patternsCollection);
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
