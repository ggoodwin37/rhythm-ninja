var slug = require('slug');
var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

module.exports = View.extend({
	template: templates.views.pool['sample-entry'],
	events: {
	},
	initialize: function(params) {
		var self = this;
		params = params || {};
		this.name = params.name || 'Untitled';
		this.testUrl = params.testUrl || null;
		this.percentage = params.initialPercentage || 0;
		this.progressBarEl = null;
	},
	render: function() {
		this.renderWithTemplate({
			name: this.name,
			testUrl: this.testUrl,
			slugger: slug
		});
		this.progressBarEl = this.queryByHook('progress-bar');
		this.setPercentage(this.percentage);
	},
	setPercentage: function(percentage) {
		this.percentage = Math.max(Math.min(100, Math.round(percentage)), 0);
		if (this.progressBarEl) {
			if (this.percentage === 100) {
				//dom.css(this.progressBarEl, 'width', '0');  // TODO: get a way to write css, ampersand-dom doesn't have it
				dom.text(this.progressBarEl, 'Loaded');
				return;
			}
			var percentStr = '' + percentage + '%';
			dom.text(this.progressBarEl, percentStr);
			//dom.css(this.progressBarEl, 'width', percentStr);
		}
	},
	setName: function(name) {
		this.name = name;
	},
	setTestUrl: function(url) {
		this.testUrl = url;
	}
});
