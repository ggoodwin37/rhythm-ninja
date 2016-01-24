module.exports = function(ctx, lab) {
	var inspect = require('eyes').inspector({maxLength: null});

	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	describe('server init, routing, etc', function () {

		it('loaded config', function(done) {
			expect(!!ctx.app.config).to.equal(true);
			expect(ctx.app.config.logThings).to.be.an.object();
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
			if(ctx.app.config.logThings['test--show-all-api-routes']) {
				ctx.table.forEach(function(tableEntry) {
					tableEntry.table.forEach(function(innerTableEntry) {
						console.log('' + innerTableEntry.method + ' ' + innerTableEntry.path);
					});
				});
			}

			done();
		});

	});

};
