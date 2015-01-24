var View = require('ampersand-view');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.set.patterns,
	// bindings: {
	// 	'model.foo': 'bar-role'
	// },
	initialize: function(params) {
		var self = this;

		console.log('INIT SET->PATTERNS VIEW');
		// TODO: need model collection/array here, or else need to listen for when it gets set.
		//  I wouldn't mind listener approach, that way we can render ourselves in loading state
		//  before api call is done.
		console.log('patterns subview initialized', params);
		this.model = params.model;
		this.model.on('change:patterns', function() {
			console.log('MODEL PATTERNS CHANGED', self.model.patterns);
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
		console.log('RENDERING WITH NUM PATTERNS=' + patterns.length);
		this.renderWithTemplate({patterns: patterns});
	},
	setLoading: function(isLoading) {
		console.log('setLoading:' + isLoading);
	}
});
