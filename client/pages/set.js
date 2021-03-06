var View = require('ampersand-view');
var templates = require('../templates');
var PoolView = require('../views/set/pool.js');
var PatternsView = require('../views/set/patterns.js');
var PoolView = require('../views/set/pool.js');
var SongsView = require('../views/set/songs.js');

module.exports = View.extend({
	template: templates.pages.set,
	subviews: {
		pool: {
			hook: 'pool',
			prepareView: function(el) {
				var self = this;
				this.poolSubview = new PoolView({
					el: el,
					model: this.model
				});
				return this.poolSubview;
			}
		},
		patterns: {
			hook: 'patterns',
			prepareView: function(el) {
				var self = this;
				this.patternSubview = new PatternsView({
					el: el,
					model: this.model
				});
				return this.patternSubview;
			}
		},
		songs: {
			hook: 'songs',
			prepareView: function(el) {
				var self = this;
				this.songSubview = new SongsView({
					el: el,
					model: this.model
				});
				return this.songSubview;
			}
		}
	},
	// TODO: fix this binding so set name shows up in header
	bindings: {
		'model.name': 'setName'
	},
	initialize: function(params) {
		var self = this;

		this.poolSubview = null;
		this.patternSubview = null;
		this.songSubview = null;

		this.params = params || {};

		this.model = window.app.getCachedSetModel(this.params.setName);
		this.model.on('model-loaded', function(model) {
			// TODO: shouldn't each subview do this itself? and why do these need the whole set anyways?
			if (self.patternSubview) self.patternSubview.model = model;
			if (self.poolSubview) self.poolSubview.model = model;
			if (self.songSubview) self.songSubview.model = model;
		});
	},
	render: function() {
		this.renderWithTemplate();
	}
});
