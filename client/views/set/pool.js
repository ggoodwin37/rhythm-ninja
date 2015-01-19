var View = require('ampersand-view');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.set.pool,
	bindings: {
		'model.foo': 'bar-role'
	},
	render: function() {
		this.renderWithTemplate();
		// this.renderSubview(new SomeSubView({
		// 	model: this.model.get('some-sub-model')
		// }), '[role=subViewRole]');
	}
});
