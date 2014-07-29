var Router = require('ampersand-router'),
	querystring = require('querystring');

var HomePage = require('./pages/home'),
	HowlsPage = require('./pages/howls');

module.exports = Router.extend({
	routes: {
		'': 'home',
		'howls': 'howls',
		'auth/login': 'login',
		'auth/callback': 'authCallback'
	},

	home: function() {
		this.trigger('page', new HomePage());
	},
	howls: function() {
		this.trigger('page', new HowlsPage());
	},
	login: function() {
		var redirectUri = encodeURIComponent(window.location.origin + '/auth/callback');
		window.location = window.app.config.apiUrlBase + '/authorize?redirect_uri=' + redirectUri;
	},
	authCallback: function() {
		var hash = window.location.hash;
		var params = querystring.parse(hash.substr(1));
		var accessToken = params.access_token;
		if (!accessToken) {
			console.log('bad/missing access token');
			return;
		}
		window.app.me.accessToken = accessToken;
		this.redirectTo('/howls');
	}
});
