var Router = require('ampersand-router');
var querystring = require('querystring');
var HomePage = require('./pages/home');
var PatternPage = require('./pages/pattern');
var PoolPage = require('./pages/pool');
var SetPage = require('./pages/set');
var SongPage = require('./pages/song');
var Test1Model = require('./models/test1');

module.exports = Router.extend({
	routes: {
		'': 'home',
		'set/:set': 'set',
		'set/:set/pattern/:pattern': 'pattern',
		'set/:set/pool': 'pool',
		'set/:set/song': 'song'
	},

	home: function() {
		this.trigger('page', new HomePage());
	},

	// TODO: need to get the model for the given set (or set.pattern) and pass to each page.
	set: function(setName) {
		this.trigger('page', new SetPage({setName: setName}));
	},
	pattern: function(setName, patternName) {
		this.trigger('page', new PatternPage({setName: setName, patternName: patternName}));
	},
	pool: function(setName) {
		this.trigger('page', new PoolPage({setName: setName}));
	},
	song: function(setName) {
		this.trigger('page', new SongPage({setName: setName}));
	}
});
