var Router = require('ampersand-router');
var querystring = require('querystring');
var HomePage = require('./pages/home');
var PatternPage = require('./pages/pattern');
var PoolPage = require('./pages/pool');
var SetPage = require('./pages/set');
var SongPage = require('./pages/song');
var UnauthorizedPage = require('./pages/unauthorized');

module.exports = Router.extend({
	routes: {
		'': 'home',
		'set/:set': 'set',
		'set/:set/pattern/:pattern': 'pattern',
		'set/:set/pool': 'pool',
		'set/:set/song/:song': 'song',

		'401': 'unauthorized'
	},

	home: function() {
		this.trigger('page', new HomePage());
	},
	set: function(setName) {
		this.trigger('page', new SetPage({setName: setName}));
	},
	pattern: function(setName, patternName) {
		this.trigger('page', new PatternPage({setName: setName, patternName: patternName}));
	},
	pool: function(setName) {
		this.trigger('page', new PoolPage({setName: setName}));
	},
	song: function(setName, songName) {
		this.trigger('page', new SongPage({setName: setName, songName: songName}));
	},
	unauthorized: function() {
		this.trigger('page', new UnauthorizedPage());
	}
});
