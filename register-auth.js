var inspect = require('eyes').inspector({maxLength: null});

function registerAuth(server, config) {
	if (config.twitterAuth) {
		var isSecure = false;  // TODO: enable isSecure (need to turn on https first)
		server.auth.strategy('twitter', 'bell', {
			provider: 'twitter',
			password: config.cookieEncryptionPassword,
			clientId: config.twitterAuth.clientId,
			clientSecret: config.twitterAuth.clientSecret,
			isSecure: isSecure
		});
		server.auth.strategy('session', 'cookie', {
			password: config.cookiePassword,
			cookie: 'sid',
			redirectTo: '/login',
			isSecure: isSecure
		});
		server.route({
			method: ['GET', 'POST'],
			path: '/login',
			config: {
				auth: 'twitter',
				handler: function(request, reply) {
					var twitterName = request.auth.credentials.profile.username;
					var userInfo = {
						rnUserKey: twitterName + '_twitter'
					};
					request.auth.session.set(userInfo);
					console.log('user logged in:');
					inspect(userInfo);
					// TODO: need to apply session strategy to a test endpoint, and verify request.auth.session there.
					return reply('<pre>' + JSON.stringify(userInfo) + '</pre>');
				}
			}
		});
		server.route({
			method: 'POST',
			path: '/logout',
			handler: function(request, reply) {
				if (request.auth && request.auth.session) {
					request.auth.session.clear();
					console.log('cleared session');
				}
				return reply('<h2>You are now logged out.</h2>');
			}
		});
	}
}

module.exports = registerAuth;
