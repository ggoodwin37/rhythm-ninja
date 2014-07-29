var Router = require('ampersand-router');
var querystring = require('querystring');
var HomePage = require('./pages/home');
var PatternPage = require('./pages/pattern');
var PoolPage = require('./pages/pool');
var SetPage = require('./pages/set');
var SongPage = require('./pages/song');

module.exports = Router.extend({
	routes: {
		'': 'home',
		':set': 'set',
		':set/pattern/:pattern': 'pattern',
		':set/pool': 'pool',
		':set/song': 'song'
	},

	home: function() {
		this.trigger('page', new HomePage());
	},
	set: function(setName) {
		debugger;
		this.trigger('page', new SetPage(setName));
	},
	pattern: function(setName, patternName) {
		this.trigger('page', new PatternPage(setName, patternName));
	},
	pool: function(setName) {
		this.trigger('page', new PoolPage(setName));
	},
	song: function(setName) {
		this.trigger('page', new SongPage(setName));
	}
});
