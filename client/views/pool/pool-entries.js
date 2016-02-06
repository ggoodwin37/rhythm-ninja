var slug = require('slug');
var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

module.exports = View.extend({
	template: templates.views.pool['pool-entries'],
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.model.on('change:pool', function() {
			self.render();
		});
	},
	render: function() {
		var pool = (this.model && this.model.pool) ? this.model.pool : null;
		this.renderWithTemplate({
			pool: pool,
			setName: this.model.name,
			slugger: slug
		});
		this.setLoading(!pool);
	},
	setLoading: function(isLoading) {
		var el = this.queryByHook('pool-entries-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	}
});
