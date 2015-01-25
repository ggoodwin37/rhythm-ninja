var View = require('ampersand-view'),
	templates = require('../templates');

var StepGridView = require('../views/pattern/step-grid.js');

module.exports = View.extend({
	template: templates.pages.pattern,
	subviews: {
		stepGrid: {
			hook: 'step-grid',
			prepareView: function(el) {
				var self = this;
				this.stepGridSubview = new StepGridView({
					el: el,
					model: this.model
				});
				return this.stepGridSubview;
			}
		}
	},
	initialize: function(params) {
		var self = this;

		this.stepGridSubview = null;

		console.log('pattern page params: ' + JSON.stringify(params));
		this.params = params || {};
		var setModel = window.app.getCachedSetModel(this.params);
		this.model = setModel.patterns.filter(function(pattern) { return pattern._id === self.params.patternId; })[0];

		this.model.on('model-loaded', function(model) {
			if (self.stepGridSubview) self.stepGridSubview.model = model;
		});
	},
	render: function() {
		this.renderWithTemplate();
	}
});
