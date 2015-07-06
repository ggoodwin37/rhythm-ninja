var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

module.exports = View.extend({
	template: templates.views.pool.samples,
	events: {
		'change .file-input-button': 'onFileInputChanged'
	},
	initialize: function(params) {
		var self = this;

		this.model = params.model;
		this.model.on('change:pool', function() {
			self.render();
		});
	},
	render: function() {
		var pool = (this.model && this.model.pool) ? this.model.pool : null;
		this.renderWithTemplate({
			pool: pool,
			setName: this.model.name,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});
		this.setLoading(!pool);
	},
	setLoading: function(isLoading) {
		var el = this.queryByHook('samples-container');
		var className = 'default-loading';
		if (isLoading) {
			dom.addClass(el, className);
		} else {
			dom.removeClass(el, className);
		}
	},
	onFileInputChanged: function(ev) {
		var files = ev.target.files;
		console.log(files);
	}
});
