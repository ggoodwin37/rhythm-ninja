var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

var SampleEntryView = require('./sample-entry');

module.exports = View.extend({
	template: templates.views.pool.samples,
	events: {
		'change .file-input': 'onFileInputChanged',
		'click .file-input-link': 'onFileInputLinkClicked'
	},
	initialize: function(params) {
		var self = this;

		this.sampleSubviews = [];

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
		var sampleContainer = this.queryByHook('sample-entries-container');
		var emptyEl = this.query('.no-samples');
		if (this.sampleSubviews.length) {
			this.sampleSubviews.forEach(function(subview) {
				subview.render();
				sampleContainer.appendChild(subview.el);
			});
			dom.hide(emptyEl);
		} else {
			dom.show(emptyEl);
		}
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
		var url = '/api/sample';
		Array.prototype.forEach.call(files, function(thisFile) {
			var subview = new SampleEntryView({
				name: getSampleNameFromFile(thisFile)
			});
			self.sampleSubviews.push(subview);
			self.uploadFile(thisFile, url, subview);
		});
		self.render();
	},
	onFileInputLinkClicked: function(ev) {
		// the file input button can't be styled, so keep it hidden and click it programmatically.
		this.query('.file-input').click();
	},
	uploadFile: function(file, url, subview) {
		var self = this;
		var reader = new FileReader();
		var xhr = new XMLHttpRequest();
		xhr.upload.addEventListener('progress', function(e) {
			if (e.lengthComputable) {
				var percentage = Math.round((e.loaded * 100) / e.total);
				self.onUploadProgress(file, subview, percentage);
			}
		}, false);
		xhr.addEventListener('load', function(e) {
			var response = JSON.parse(this.responseText);
			self.onUploadComplete(file, response, subview);
		});
		xhr.open('POST', url);
		xhr.setRequestHeader('content-type', file.type);
		console.log('uploading file with content-type: ' + file.type);

		reader.onload = function(e) {
			sendAsBinary(xhr, e.target.result);
		};
		reader.readAsBinaryString(file);
	},
	onUploadComplete: function(file, response, subview) {
		subview.setTestUrl('/api/sample/' + response.id);
		subview.setPercentage(100);
		subview.render();
	},
	onUploadProgress: function(file, subview, percentage) {
		subview.setPercentage(percentage);
	}
});

// a browser-compatible version of the moz-only xhr.sendAsBinary, credit: the internet
function sendAsBinary(xhr, dataStr) {
	function byteValue(x) {
		return x.charCodeAt(0) & 0xff;
	}
	var ords = Array.prototype.map.call(dataStr, byteValue);
	var ui8a = new Uint8Array(ords);
	xhr.send(ui8a.buffer);
}

function getSampleNameFromFile(file) {
	return file.name || 'Untitled';
}
