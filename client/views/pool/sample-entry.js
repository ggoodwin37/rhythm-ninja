var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

module.exports = View.extend({
	template: templates.views.pool['sample-entry'],
	events: {
	},
	initialize: function(params) {
		var self = this;

		// TODO: what model for this, if any?
		// this.model = params.model;
		// this.model.on('change:pool', function() {
		// 	self.render();
		// });
	},
	render: function() {
		// var pool = (this.model && this.model.pool) ? this.model.pool : null;
		var loaded = true;
		this.renderWithTemplate({
			name: 'TEST-NAME',
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!loaded);
	},
	setLoading: function(isLoading) {
		var el = this.queryByHook('sample-entry-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	},
});
