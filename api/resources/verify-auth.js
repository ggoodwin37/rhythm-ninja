var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var boom = require('boom');

function verifyAuth(app) {
	return function(request, reply) {
		// TODO: add user field to set on write, check on read. <-- err, what does this mean? :/
		if (app.authConfig) {
			if (!(request.auth && request.auth.isAuthenticated)) {
				reply(boom.unauthorized('not authenticated'));
				return false;
			}
			inspect('verifyAuth:');
			inspect(request.auth);
		}
		return true;
	}
}

module.exports = verifyAuth;
