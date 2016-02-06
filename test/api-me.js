var fs = require('fs');

module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	// these tests are kind of crappy since we're relying on the special test header. Not really exercising much
	// of the auth code.
	describe('verify me api', () => {
		// TODO: fix this. Auth is disabled overall for test app so we aren't getting 401s here.
		it.skip('should 401 if I\'m not authenticated', done => {
			ctx.server.inject({
				method: 'get',
				url: '/api/user/me'
				// missing the x-under-test header, simulating being not auth'd
			}, res => {
				expect(res.statusCode).to.equal(401);
				done();
			});
		});
		it('should tell me about myself if I am authenticated', done => {
			ctx.server.inject({
				method: 'get',
				url: '/api/user/me',
				headers: {
					'x-under-test': '0'
				}
			}, res => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.credentials.rnUserKey).to.equal('test_user_id_0');
				done();
			});
		});
	});
};
