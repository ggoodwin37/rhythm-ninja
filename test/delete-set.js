module.exports = function(ctx, setName) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('verify delete set "' + setName + '"', function () {
		it('should delete the set', function(done) {
			ctx.server.inject({method: 'delete', url: '/api/set/' + setName}, function(res) {
				expect(res.statusCode == 200);
				done();
			});
		});
	});
};
