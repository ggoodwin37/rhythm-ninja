var View = require('ampersand-view');
var templates = require('../templates');
var PoolView = require('../views/set/pool.js');
var PatternsView = require('../views/set/patterns.js');
var SongsView = require('../views/set/songs.js');

var Set = require('../models/set');

module.exports = View.extend({
	template: templates.pages.set,
	subviews: {
		pool: {
			constructor: PoolView,
			role: 'pool'
		},
		patterns: {
			container: '[role=patterns]',
			// TODO: resume here. trying to figure out how to hook up the rehydrated patterns with
			//  the pattern subview. this waitFor trigger is breaking somehow. would prefer to wait
			//  for the whole model, but I think that means I have to instantiate this.model differently
			//  than I'm doing now in initialize()
			// waitFor: 'model.patterns',
			prepareView: function(el) {
				return new PatternsView({
					el: el,
					model: this.model.patterns
				});
			}
		},
		songs: {
			constructor: SongsView,
			role: 'songs'
		}
	},
	bindings: {
		'model.name': 'setName'
	},
	initialize: function(params) {
		var self = this;
		this.params = params || {};
		this.model = new Set(this.params);
		this.model.fetch({
			success: function(model, response) {
				console.log('fetched set:', model);
			},
			error: function(model, response) {
				console.log('error fetching set:', response);
			}
		});
	},
	render: function() {
		this.renderWithTemplate();
	}
});
