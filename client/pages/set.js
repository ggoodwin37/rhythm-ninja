var View = require('ampersand-view');
var templates = require('../templates');
var PoolView = require('../views/set/pool.js');
var PatternsView = require('../views/set/patterns.js');
var SongsView = require('../views/set/songs.js');

var Set = require('../models/set');
var Patterns = require('../models/patterns');

module.exports = View.extend({
	template: templates.pages.set(),
	subviews: {
		pool: {
			constructor: PoolView,
			role: 'pool'
		},
		patterns: {
			constructor: PatternsView,
			role: 'patterns'
		},
		songs: {
			constructor: SongsView,
			role: 'songs'
		}
	},
	bindings: {
		'model.name': 'setName'
	},
	initialize: function(params) {
		var self = this;
		this.params = params || {};
		this.model = new Set(this.params);
		this.model.fetch({
			success: function(model, response) {
				console.log('successfully fetched a set:', model);
				var patterns = new Patterns(self.params);
				patterns.fetch({
					success: function(patternModels, response) {
						console.log('successfully fetched set patterns:', patternModels);
					},
					error: function(patternModels, response) {
						console.log('error fetching set patterns:', response);
					}
				});
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
