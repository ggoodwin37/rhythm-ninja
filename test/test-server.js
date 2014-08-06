module.exports = function(ctx) {
	var Lab = require('lab');
	var config = require('getconfig');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('server', function () {

		it('starts a serverInstance', function(done) {
			expect(ctx.server).to.exist;
			done();
		});

		it('has a route table', function(done) {
			ctx.table = ctx.server.table();
			expect(ctx.table).to.exist;
			done();
		});

		it('can dump all routes', function(done) {
			var inspect = require('eyes').inspector({maxLength: null});
			inspect(config);
			ctx.table.forEach(function(route) {
				if(config.logThings['test--all-api-routes']) {
					console.log('server has route: ' + ctx.getRouteKey(route));
				}
			});
			done();
		});

	});

};
