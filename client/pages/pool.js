var View = require('ampersand-view');
var templates = require('../templates');
var PoolEntriesView = require('../views/pool/pool-entries.js');
var SamplesView = require('../views/pool/samples.js');

module.exports = View.extend({
	template: templates.pages.pool,
	subviews: {
		poolEntries: {
			hook: 'pool-entries-container',
			prepareView: function(el) {
				var self = this;
				this.poolEntriesSubview = new PoolEntriesView({
					el: el,
					model: this.model
				});
				return this.poolEntriesSubview;
			}
		},
		samples: {
			hook: 'samples-container',
			prepareView: function(el) {
				var self = this;
				this.samplesSubview = new SamplesView({
					el: el,
					model: this.model
				});
				return this.samplesSubview;
			}
		}
	},
	initialize: function(params) {
		var self = this;

		this.poolEntriesSubview = null;
		this.samplesSubview = null;

		this.params = params || {};

		this.model = window.app.getCachedSetModel(this.params.setName);  // TODO: get rid of global ref, pass in app.
		this.model.on('model-loaded', function(model) {
			// if (self.poolEntriesSubview) self.poolEntriesSubview.model = model;
			self.model = model;
		});
	},
	render: function() {
		var self = this;
		this.renderWithTemplate({
			setName: this.params.setName,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});

		// TODO: do we actually need to fetch here (in addition to seto)?
		//       does this no-op if we already loaded set? what about when we load this page directly?
		this.model.fetch({
			success: function(model, response) {
				console.log('pool model fetch success: ' + JSON.stringify(response));
				console.log('  id is: ' + self.id);
			},
			error: function(model, response, options) {
				console.log('pool model fetch error. response: ' + JSON.stringify(response));
			}
		});

	}
});
