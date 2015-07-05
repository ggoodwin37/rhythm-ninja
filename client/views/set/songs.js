var View = require('ampersand-view');
var dom = require('ampersand-dom');
var templates = require('../../templates');

module.exports = View.extend({
	template: templates.views.set.songs,
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.model.on('change:songs', function() {
			self.render();
		});
	},
	render: function() {
		var songs = (this.model && this.model.songs) ? this.model.songs : null;
		this.renderWithTemplate({
			songs: songs,
			setName: this.model.name,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!songs);
	},
	setLoading: function(isLoading) {
		var el = this.queryByHook('songs-view-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	}
});
