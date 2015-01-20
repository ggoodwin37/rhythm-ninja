var View = require('ampersand-view');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.set.patterns,
	// bindings: {
	// 	'model.foo': 'bar-role'
	// },
	initialize: function(params) {
		// TODO: need model collection/array here, or else need to listen for when it gets set.
		//  I wouldn't mind listener approach, that way we can render ourselves in loading state
		//  before api call is done.
		console.log('patterns subview initialized', params);
	},
	render: function() {
		this.renderWithTemplate();
		// this.renderSubview(new SomeSubView({
		// 	model: this.model.get('some-sub-model')
		// }), '[role=subViewRole]');
	}
});
