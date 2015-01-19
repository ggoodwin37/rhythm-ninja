var View = require('ampersand-view');
var templates = require('../templates');
var PoolView = require('../views/set/pool.js');
var PatternsView = require('../views/set/patterns.js');
var SongsView = require('../views/set/songs.js');

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
		this.params = params || {};
	},
	render: function() {
		this.renderWithTemplate();
		if (!this.model) {
			this.fetchModel();
		}
		// TODO: need to render subviews?
	},
	fetchModel: function() {
		if (!this.params.setName) {
			console.log('can\'t get a set unless I have a set name.');
			return;
		}

		console.log('requesting set model with setName: ' + this.params.setName);
		app.sets.getOrFetch(this.params.setName, function(err, model) {
			console.log('received set model:', model);
		});
	}
});
