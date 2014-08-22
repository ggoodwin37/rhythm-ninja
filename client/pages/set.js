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
	render: function() {
		this.renderWithTemplate();
		// TODO: need to render subviews?
	}
});
