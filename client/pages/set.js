var View = require('ampersand-view');
var Events = require('ampersand-events');
var templates = require('../templates');
var PoolView = require('../views/set/pool.js');
var PatternsView = require('../views/set/patterns.js');
var SongsView = require('../views/set/songs.js');

var Set = require('../models/set');

module.exports = View.extend({
	template: templates.pages.set,
	subviews: {
		pool: {
			constructor: PoolView,
			hook: 'pool'
		},
		patterns: {
			hook: 'patterns',
			prepareView: function(el) {
				var self = this;
				var subview = new PatternsView({
					el: el,
					model: this.model
				});
				// TODO: probably need to update other subviews on this same event, so should consolidate.
				this.on('model-loaded', function(model) {
					subview.model = model;
				});
				return subview;
			}
		},
		songs: {
			constructor: SongsView,
			hook: 'songs'
		}
	},
	// TODO: fix this binding so set name shows up in header
	bindings: {
		'model.name': 'setName'
	},
	initialize: function(params) {
		var self = this;
		this.params = params || {};
		this.model = new Set(this.params);
		this.model.fetch({
			success: function(model, response) {
				self.trigger('model-loaded', model);
			},
			error: function(model, response) {
				console.log('error fetching set:', response);
			}
		});
	},
	render: function() {
		this.renderWithTemplate();
	}
});
