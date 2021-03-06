var slug = require('slug');
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
			slugger: slug
		});
	}
});
