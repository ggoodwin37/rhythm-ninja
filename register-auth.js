var inspect = require('eyes').inspector({maxLength: null});

function registerAuth(server, app) {
	if (app.config.twitterAuth) {
		var isSecure = false;  // TODO: enable isSecure (need to turn on https first)
		server.auth.strategy('twitter', 'bell', {
			provider: 'twitter',
			password: app.config.cookieEncryptionPassword,
			clientId: app.config.twitterAuth.clientId,
			clientSecret: app.config.twitterAuth.clientSecret,
			isSecure: isSecure
		});
		// using mode 'optional' and no redirectUrl here so that we can get unauthenticated requests
		// to our handlers. This will let us handle 'guest' scenarios. We will still do some checking
		// of the auth info in the handlers and potentially 401 out.
		// TODO: still can't get an unauthorized request into user-info, hapi is 401'ing before I get there?
		server.auth.strategy('session', 'cookie', 'optional', {
			password: app.config.cookiePassword,
			cookie: 'sid',
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
			method: ['GET', 'POST'],  // TODO: seems like this should be POST only, but will require extra handling on client side
			path: '/logout',
			handler: function(request, reply) {
				if (request.auth && request.auth.session) {
					request.auth.session.clear();
					console.log('cleared session');
				}
				return reply('<h2>You are now logged out.</h2>');
			}
		});
		server.route({
			method: 'GET',
			path: '/user-info',
			handler: function(request, reply) {
				if (request.auth && request.auth.isAuthenticated) {
					return reply('<h2>You are currently logged in:</h2><pre>' + JSON.stringify(request.auth.credentials) + '</pre>');
				} else {
					return reply('<h2>You are not logged in at the moment</h2>');
				}
			},
			config: {
				auth: {
					strategy: 'session'
				}
			}
		});
		app.authConfig = {
			strategy: 'session'
		};
	}
}

module.exports = registerAuth;
