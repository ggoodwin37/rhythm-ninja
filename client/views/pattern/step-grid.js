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
	getRowModels: function() {
		if (this.patternModel && this.patternModel.rows && this.patternModel.rows.models) {
			return this.patternModel.rows.models;
		}
		return null;
	},
	render: function() {
		var rowModels = this.getRowModels();
		this.renderWithTemplate({
			rows: rowModels,
			setName: this.setName,
			patternName: this.patternName,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(rowModels === null);
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
		var rowModels = this.getRowModels();
		var matches = rowModels.filter(function(otherRow) {
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
		var patternLength = this.patternModel.length;
		var stepData = [];
		for (var i = 0; i < patternLength; ++i) stepData.push(0);
		var rowData = {
			poolEntry: 'blank',
			steps: stepData
		};
		var rowOptions = {
			setName: this.setName,
			patternId: this.patternModel.id
		};
		this.patternModel.rows.create(rowData, rowOptions);
		this.render();
	},
	handleDeleteRowClick: function(ev) {
		var rowId = ev.target.dataset.rowId || null;
		var rowModel = this.getRowById(rowId);
		if (!rowModel) {
			console.warn('problem: non-existent delete button?');
			return;
		}
		// TODO: improve this. Need a more general way to pass arbitrary data to models.
		//       models are either rehydrated at load, or created client-side during add.
		rowModel.setName = this.setName;
		rowModel.patternId = this.patternModel.id;
		rowModel.destroy();
		this.render();
	},
	destroy: function() {
		// TODO: this is not being called. probably need to call this explicitly from page destroy
		console.log('just testing. step-grid::destroy() called.');
	}
});
