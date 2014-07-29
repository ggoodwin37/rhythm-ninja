var domready = require('domready');

var MainView = require('./views/main');
var Router = require('./router');

window.app = {
	config: config,
	init: function() {
		var self = this;

		//this.me = new Me();

		this.router = new Router();

		domready(function() {
			self.view = new MainView({
				el: document.body
			});
			self.router.history.start({pushState: true});
			self.me.fetch();
		});
	}
};

window.app.init();
