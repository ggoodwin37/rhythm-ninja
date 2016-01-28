module.exports = function(ctx, lab, setName, expectedCode) {
	// Test shortcuts
	var expect = require('code').expect;
	var describe = lab.experiment;
	var it = lab.test;

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
