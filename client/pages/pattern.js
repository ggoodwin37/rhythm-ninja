var slug = require('slug');

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

		this.params = params || {};

		this.model = window.app.getCachedSetModel(this.params.setName);  // TODO: get rid of global ref, pass in app.
		this.model.on('model-loaded', function(model) {
			if (self.stepGridSubview) self.stepGridSubview.model = model;
			self.model = model;
		});
	},
	render: function() {
		this.renderWithTemplate({
			setName: this.params.setName,
			slugger: slug
		});
	}
});
