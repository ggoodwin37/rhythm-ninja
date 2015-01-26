var domready = require('domready');

var MainView = require('./views/main');
var Router = require('./router');

var Set = require('./models/set');

var clientConfig = require('./client-config.json');

window.app = {
	config: clientConfig,
	init: function() {
		var self = this;

		//this.me = new Me();

		this.cachedSets = {};

		this.router = new Router();

		domready(function() {
			self.view = new MainView({
				el: document.body
			});
			self.router.history.start({pushState: true});
		});
	},
	getCachedSetModel: function(setName) {
		var self = this;
		var setModel, xhr;
		if (this.cachedSets[setName]) {
			setModel = this.cachedSets[setName].model;
			xhr = this.cachedSets[setName].xhr;
			if (!xhr) {
				setTimeout(function() {
					setModel.trigger('model-loaded', setModel);
				}, 0);
			}
		} else {
			setModel = new Set(setName);
			xhr = setModel.fetch({
				success: function(model, response) {
					setModel.trigger('model-loaded', setModel);
					self.cachedSets[setName].xhr = null;
				},
				error: function(model, response) {
					setModel.trigger('model-load-error', setModel, response);
					self.cachedSets[setName].xhr = null;
					console.log('error fetching set:', response);
				}
			});
			this.cachedSets[setName] = {
				model: setModel,
				xhr: xhr
			}
		}
		return setModel;
	}
};

// TODO: figure out how to pass in a config here.
window.app.init();
