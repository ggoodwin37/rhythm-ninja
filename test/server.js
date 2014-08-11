module.exports = function(ctx) {
	var Lab = require('lab');
	var inspect = require('eyes').inspector({maxLength: null});

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('server', function () {

		it('loaded config', function(done) {
			expect(!!ctx.app.config).to.equal(true);
			expect(ctx.app.config.logThings).to.be.an('object');
			if (ctx.app.config.logThings['test--show-config']) {
				inspect(ctx.app.config);
			}
			done();
		});

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
				if(ctx.app.config.logThings['test--show-all-api-routes']) {
					console.log(ctx.getRouteKey(route));
				}
			});
			done();
		});

	});

};
