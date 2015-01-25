var View = require('ampersand-view'),
	ViewSwitcher = require('ampersand-view-switcher'),
	dom = require('ampersand-dom');
var templates = require('../templates');

module.exports = View.extend({
	template: templates.body,
	autoRender: true,
	events: {
		'click a.client-nav': 'handleNavClick'
	},
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
	},
	handleNavClick: function(e) {
		e.preventDefault();
		var targetRoute = e.target.getAttribute('data-dest-route');
		window.app.router.navigate(targetRoute, {trigger: true});
	}
});
