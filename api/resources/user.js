var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

function checkTestAuth(request, reply) {
	// TODO: consider moving this under-test shit into verify-auth
	const underTest = request.headers['x-under-test'];
	if (!!underTest && underTest.length < 2) {
		const testUserName = 'test_user_id_' + underTest;

		reply({
			isAuthenticated: true,
			credentials: {
				rnUserKey: testUserName
			},
			artifacts: {
				rnUserKey: testUserName
			},
			session: {},
			mode: 'required',
			strategy: 'session'
		});
		return true;
	}
	return false;
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
				// first, check for our janky test user auth scheme
				if (checkTestAuth(request, reply)) return;

				// not a test user, check for real auth
				if (!verifyAuth(request, reply)) return;

				if (request.params.user_id !== 'me') {
					return reply(boom.notImplemented());
				}
				reply({
					rnUserKey: request.auth.credentials.rnUserKey,
					accessToken: 'FOR FUCK SAKE FIX THIS'
				});
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
