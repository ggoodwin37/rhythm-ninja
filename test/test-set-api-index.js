module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('set-api-set-index', function() {
		it('really ought to give me a list of all sets in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/set'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-sets']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});
	});
};
