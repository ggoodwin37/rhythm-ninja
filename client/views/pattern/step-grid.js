var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.pattern.stepGrid,
	events: {
		'click td.grid-step': 'handleGridStepClick'
	},
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.setName = params.setName;
		this.patternName = params.patternName;
		// TODO: this is going down a bad road where the set is a true model but all subelements are treated as raw js objects.
		//   maybe need to add models for all subelements? how to instantiate them?
		this.patternData = null;
		this.model.on('model-loaded', function() {
			self.patternData = self.model.patterns.filter(function(thisPattern) {
				return thisPattern.name === self.patternName;
			})[0];
			self.render();
		});
		// TODO: need to off this event too, since it's on the model which outlives this view.
	},
	render: function() {
		var rows = (this.patternData && this.patternData.rows) ? this.patternData.rows : null;
		this.renderWithTemplate({
			rows: rows,
			setName: this.setName,
			patternName: this.patternName,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!rows);
	},
	// TODO: this should be shared
	setLoading: function(isLoading) {
		var el = this.queryByHook('step-grid-view-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	},
	handleGridStepClick: function(ev) {
		if (dom.hasClass(ev.target, 'step-on')) {
			dom.removeClass(ev.target, 'step-on');
		} else {
			dom.addClass(ev.target, 'step-on');
		}
		// TODO: update model
		//console.log('ev rowId=' + ev.target.dataset.rowId + ' stepIndex=' + ev.target.dataset.stepIndex);
	}
});
