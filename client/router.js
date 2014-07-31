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
		':set': 'set',
		':set/pattern/:pattern': 'pattern',
		':set/pool': 'pool',
		':set/song': 'song'
	},

	home: function() {
		this.trigger('page', new HomePage());
	},

	// TODO: need to get the model for the given set (or set.pattern) and pass to each page.
	set: function(setName) {
		this.trigger('page', new SetPage());
	},
	pattern: function(setName, patternName) {
		this.trigger('page', new PatternPage());
	},
	pool: function(setName) {
		// TODO gideong: what's the real pattern here? we need to do a server fetch for this test model.
		//  we should render the rest of the page now, though.
		var test1Model = new Test1Model({id: 'fake-id', name: 'fake-name'});
		this.trigger('page', new PoolPage({model: test1Model}));
	},
	song: function(setName) {
		this.trigger('page', new SongPage());
	}
});
