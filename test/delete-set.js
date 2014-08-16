module.exports = function(ctx, setName, expectedCode) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var describe = Lab.experiment;
	var it = Lab.test;

	expectedCode = expectedCode || 200;

	describe('verify delete set "' + setName + '" gives code ' + expectedCode, function () {
		it('should delete the set', function(done) {
			ctx.server.inject({method: 'delete', url: '/api/set/' + setName}, function(res) {
				expect(res.statusCode).to.equal(expectedCode);
				done();
			});
		});
	});
};
