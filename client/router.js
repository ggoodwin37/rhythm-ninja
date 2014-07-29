var Router = require('ampersand-router');
var querystring = require('querystring');
var HomePage = require('./pages/home');
module.exports = Router.extend({
	routes: {
		'': 'home'
	},

	home: function() {
		this.trigger('page', new HomePage());
	}
});
