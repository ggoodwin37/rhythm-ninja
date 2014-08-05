module.exports = function(ctx) {
	var Lab = require('lab');

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
			ctx.table.forEach(function(route) {
				console.log('server has route: ' + ctx.getRouteKey(route));
			});
			done();
		});

	});

};
