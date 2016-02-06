var View = require('ampersand-view');
var templates = require('../../templates');
var dom = require('ampersand-dom');

var SampleEntryView = require('./sample-entry');

var UserSamples = require('../../models/user-samples');

module.exports = View.extend({
	template: templates.views.pool.samples,
	events: {
		'change .file-input': 'onFileInputChanged',
		'click .file-input-link': 'onFileInputLinkClicked'
	},
	initialize: function(params) {
		var self = this;

		// when uploading samples, we'll have local-only views, keep track so we can render as needed.
		this.localSubviews = [];

		this.model = params.model;

		// TODO: consider caching user samples? now we'll refetch every time we nav to pool
		this.meSamples = new UserSamples();
		this.didLoadMeSamples = false;

		// we need to have our current user name to grab their samples. we might already have it,
		// or we might still be waiting for the app to load it (in the case where we are loading
		// pool page directly). We want to do the same thing in either case.
		var onMeLoaded = function() {
			window.app.me.rnUserKey || console.log('expected user key to be ready');
			self.fetchMeSamples(window.app.me.rnUserKey);
		};
		window.app.eventBus.on('me-loaded', onMeLoaded);
		if (window.app.meLoaded()) {
			onMeLoaded();
		}
	},
	render: function() {
		this.setLoading(!this.didLoadMeSamples);

		this.renderWithTemplate({
			setName: this.model.name,
			slugger: function(input) {
				return input.replace(' ', '-'); // TODO: better slugger
			}
		});

		var sampleContainer = this.queryByHook('sample-entries-container');
		var isEmpty = true;

		// render subviews for any loaded samples
		if (this.meSamples.samples.length) {
			isEmpty = false;
			this.meSamples.samples.forEach(function(thisSample) {
				var subview = new SampleEntryView({
					name: thisSample.name,
					testUrl: '/api/sample/' + thisSample.id,
					initialPercentage: 100
				});
				subview.render();
				sampleContainer.appendChild(subview.el);
			});
		}
		// render stored subviews for any samples uploaded recently
		if (this.localSubviews.length) {
			isEmpty = false;
			this.localSubviews.forEach(function(thisLocalSubview) {
				thisLocalSubview.render();
				sampleContainer.appendChild(thisLocalSubview.el);
			});
		}

		var emptyEl = this.query('.no-samples');
		isEmpty ? dom.show(emptyEl) : dom.hide(emptyEl);
	},
	fetchMeSamples: function(userKey) {
		var self = this;

		this.meSamples.set('userId', userKey);
		this.meSamples.fetch({
			success: function(model, response) {
				self.didLoadMeSamples = true;
				self.render();
			},
			error: function(model, response) {
				console.log('mesample fetch error', response);
			}
		});
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
			var subview = new SampleEntryView();
			self.localSubviews.push(subview);
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
		xhr.setRequestHeader('x-sample-name', getSampleNameFromFile(file));
		console.log('uploading file with content-type: ' + file.type);

		reader.onload = function(e) {
			sendAsBinary(xhr, e.target.result);
		};
		reader.readAsBinaryString(file);
	},
	onUploadComplete: function(file, response, subview) {
		subview.setName(response.name);
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
