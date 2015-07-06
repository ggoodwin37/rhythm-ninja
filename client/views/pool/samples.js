var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

module.exports = View.extend({
	template: templates.views.pool.samples,
	events: {
		'change .file-input': 'onFileInputChanged',
		'click .file-input-link': 'onFileInputLinkClicked'
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
	onFileInputChanged: function(e) {
		var self = this;
		var files = e.target.files;
		var url = '/sample';
		Array.prototype.forEach.call(files, function(thisFile) {
			self.uploadFile(thisFile, url, null);  // TODO: container
		});
	},
	onFileInputLinkClicked: function(ev) {
		// the file input button can't be styled, so keep it hidden and click it programmatically.
		this.query('.file-input').click();
	},
	uploadFile: function(file, url, container) {
		var reader = new FileReader();
		// TODO: create some progress UI in container.
		var xhr = new XMLHttpRequest();  // TODO: consider not using raw?
		xhr.upload.addEventListener('progress', function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				console.log('upload percentage: ' + percentage);
			}
		}, false);
		xhr.upload.addEventListener('load', function(e) {
			console.log('upload complete!');
		});
		xhr.open('POST', url);

		// TODO: verify once we start using real sample files, need at least wav and mp3 support
		//xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');

		reader.onload = function(e) {
			sendAsBinary(xhr, e.target.result);
		};
		reader.readAsBinaryString(file);
	}
});

// TODO: investigate better solution to this, just need a portable way to send binary data via an xhr.
function sendAsBinary(xhr, dataStr) {
	function byteValue(x) {
		return x.charCodeAt(0) & 0xff;
	}
	var ords = Array.prototype.map.call(dataStr, byteValue);
	var ui8a = new Uint8Array(ords);
	xhr.send(ui8a.buffer);
}
