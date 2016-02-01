var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

function getUserIdFromRequest(request) {
	// check for special header indicating this is running from a test.
	// this is only used to avoid the need to have the test be auth'd
	// if set, build an id out of this value, letting us have a few different
	// test ids to faciliate cross-user test scenarios.
	const underTest = request.headers['x-under-test'];
	var sampleOwner;
	if (!!underTest && underTest.length < 2) {  // :shrug:
		const testUserIdBase = 'test_user_id_';
		sampleOwner = testUserIdBase + underTest;
	} else {
		sampleOwner = (request.auth && request.auth.credentials) ? request.auth.credentials.rnUserKey : null;
	}
	return sampleOwner;
}

module.exports = function(app) {
	var verifyAuth = require('./verify-auth')(app);
	var handlingError = require('../handling-error');
	var handlingErrorOrMissing = require('../handling-error-or-missing');
	var SampleMetaModel = require('../models/sample-meta.js')(app);
	var SampleBlobModel = require('../models/sample-blob.js')(app);

	return {
		show: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				inspect(request);
				// TODO: handle 'me', others NYI
			}
		},
		create: {
			handler: function(request, reply) {
				reply(boom.notImplemented());
			}
		},
		destroy: {
			handler: function(request, reply) {
				reply(boom.notImplemented());
			}
		}
	};
};
