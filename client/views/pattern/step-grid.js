var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.pattern.stepGrid,
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		// TODO: figure out when this needs to update
		// this.model.on('change:patterns', function() {
		// 	self.render();
		// });
	},
	render: function() {
		var patternRows = (this.model && this.model.rows) ? this.model.rows : null;
		var setName = 'foo';  // TODO: figure out how to get this generically. from app?
		this.renderWithTemplate({
			rows: rows,
			setName: setName,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!patterns);
	},
	// TODO: this should be shared
	setLoading: function(isLoading) {
		var el = this.queryByHook('step-grid-view-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	}
});
