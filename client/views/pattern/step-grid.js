var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.includes.pattern.stepGrid,
	events: {
		'click td.grid-step': 'handleGridStepClick',
		'click button.add-row': 'handleAddRowClick',
		'click button.delete-row': 'handleDeleteRowClick'
	},
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.setName = params.setName;
		this.patternName = params.patternName;
		this.patternModel = null;
		this.model.on('model-loaded', function() {
			self.patternModel = self.model.patterns.models.filter(function(thisPattern) {
				return thisPattern.name === self.patternName;
			})[0];
			self.render();
		});
		// TODO: need to off this event too, since it's on the model which outlives this view.
	},
	render: function() {
		var rowsCollection = (this.patternModel && this.patternModel.rows) ? this.patternModel.rows : null;
		this.renderWithTemplate({
			rows: rowsCollection ? rowsCollection.models : null,
			setName: this.setName,
			patternName: this.patternName,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!rowsCollection);
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
	getRowById: function(rowId) {
		var matches = this.patternModel.rows.models.filter(function(otherRow) {
			return otherRow.id === rowId;
		});
		return matches.length > 0 ? matches[0] : null;
	},
	handleGridStepClick: function(ev) {
		if (dom.hasClass(ev.target, 'step-on')) {
			dom.removeClass(ev.target, 'step-on');
		} else {
			dom.addClass(ev.target, 'step-on');
		}
		// TODO: update model
		//console.log('ev rowId=' + ev.target.dataset.rowId + ' stepIndex=' + ev.target.dataset.stepIndex);
	},
	handleAddRowClick: function(ev) {
		console.log('add row');
		// TODO: how the fuck do I implement this? need models for patternRows.
	},
	handleDeleteRowClick: function(ev) {
		var rowId = ev.target.dataset.rowId || null;
		var rowModel = this.getRowById(rowId);
		if (!rowModel) {
			console.warn('problem: non-existent delete button?');
			return;
		}
		// TODO: rowModel.destroy() should work.
	},
	destroy: function() {
		// TODO: this is not being called. probably need to call this explicitly from page destroy
		console.log('just testing. step-grid::destroy() called.');
	}
});
