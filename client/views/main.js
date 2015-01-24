var View = require('ampersand-view'),
	ViewSwitcher = require('ampersand-view-switcher'),
	dom = require('ampersand-dom');
var templates = require('../templates');

module.exports = View.extend({
	template: templates.body,
	autoRender: true,
	initialize: function() {
		this.listenTo(window.app.router, 'page', this.handlePage);
	},
	render: function() {
		this.renderWithTemplate();
		var el = this.queryByHook('page-container');
		this.pages = new ViewSwitcher(el);
	},
	handlePage: function(pageView) {
		this.pages.set(pageView);
		//this.setActiveNavItem();
	}
});
