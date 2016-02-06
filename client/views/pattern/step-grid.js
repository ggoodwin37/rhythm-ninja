var slug = require('slug');
var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

var UPDATE_DELAY = 500;  // TODO: make this higher

module.exports = View.extend({
	template: templates.views.pattern.stepGrid,
	events: {
		'click td.grid-step': 'handleGridStepClick',
		'click button.add-row': 'handleAddRowClick',
		'click button.delete-row': 'handleDeleteRowClick'
	},
	initialize: function(params) {
		var self = this;

		this.queuedUpdateTimer = null;  // TODO: extract helper module for this?
		this.writePatternUpdates = this.writePatternUpdates.bind(this);

		this.model = params.model;
		this.setName = params.setName;
		this.patternName = params.patternName;
		this.patternModel = null;
		this.model.on('model-loaded', function() {
			self.patternModel = self.model.patterns.models.filter(function(thisPattern) {
				return thisPattern.name === self.patternName;
			})[0];
			self.patternModel.setName = self.setName;  // TODO: this is annoying, find better way to set this.
			self.render();

			self.patternModel.rows.on('sync', function() {
				// this render is used to update the dom with ids when a new row was created.
				// we also render it speculatively right when its created client-side, this is
				// a little inefficient.
				self.render();
			});
		});
		// TODO: need to off any model event handlers too, since it's on the model which outlives this view.
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
			slugger: slug
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
		var rowId = ev.target.dataset.rowId;
		var rowModel = this.getRowById(rowId);
		if (!rowModel) {
			console.log('failed to find a row for step update by id: ' + rowId);
			return;
		}

		if (dom.hasClass(ev.target, 'step-on')) {
			dom.removeClass(ev.target, 'step-on');
		} else {
			dom.addClass(ev.target, 'step-on');
		}

		var stepIndex = ev.target.dataset.stepIndex;
		if (rowModel.steps[stepIndex]) {
			rowModel.steps[stepIndex] = 0;
		} else {
			rowModel.steps[stepIndex] = 1;
		}
		this.queuePatternUpdate();
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
			console.warn('problem: non-existent delete button for rowId=' + rowId);
			return;
		}
		// TODO: improve this. Need a more general way to pass arbitrary data to models.
		//       models are either rehydrated at load, or created client-side during add.
		rowModel.setName = this.setName;
		rowModel.patternId = this.patternModel.id;
		rowModel.destroy();
		this.render();
	},
	queuePatternUpdate: function() {
		// the behavior here is to schedule an update call after a delay each time this is called.
		// if one is already scheduled, cancel it and reschedule, basically pushing it back.
		if (this.queuedUpdateTimer) {
			window.clearTimeout(this.queuedUpdateTimer);
		}
		this.queuedUpdateTimer = window.setTimeout(this.writePatternUpdates, UPDATE_DELAY);
	},
	writePatternUpdates: function() {
		this.queuedUpdateTimer = null;
		this.patternModel.save();
	},
	destroy: function() {
		// TODO: this is not being called. probably need to call this explicitly from page destroy
		console.log('just testing. step-grid::destroy() called.');
		// TODO: also need to flush any non-synced updates here.
	}
});
