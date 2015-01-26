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
					model: this.model,
					setName: this.params.setName,
					patternName: this.params.patternName
				});
				return this.stepGridSubview;
			}
		}
	},
	initialize: function(params) {
		var self = this;

		this.stepGridSubview = null;

		// TODO: just pass setName in to getCachedSetModel (and in other call sites)
		this.params = params || {};
		this.model = window.app.getCachedSetModel(this.params);

		this.model.on('model-loaded', function(model) {
			if (self.stepGridSubview) self.stepGridSubview.model = model;
			self.model = model;
		});
	},
	render: function() {
		this.renderWithTemplate();
	}
});
