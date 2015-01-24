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
				console.log('PREP PATTERN SUBVIEW');
				var self = this;
				var subview = new PatternsView({
					el: el,
					model: this.model
				});
				this.on('model-loaded', function(model) {
					console.log('listener firing with model:', model);
					subview.model = model;
					// TODO: can we get subview to hear an event when this changes? then we can render stuff.
				});
				return subview;
			}
		},
		songs: {
			constructor: SongsView,
			hook: 'songs'
		}
	},
	bindings: {
		'model.name': 'setName'
	},
	initialize: function(params) {
		console.log('INIT SET PAGE');
		var self = this;
		this.params = params || {};
		Events.createEmitter(this);
		this.model = new Set(this.params);
		this.model.fetch({
			success: function(model, response) {
				console.log('MODEL LOADED: ' + model.toJSON());
				console.log('fetched set:', model);
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
