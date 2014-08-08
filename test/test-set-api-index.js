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

				if (ctx.app.config.logThings['test--show-set-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all song-infos in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/setInfo'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		// note: being cheesy and passing a fake set name 'all' here...this is ignored on the api side for index calls.
		//  to make this cleaner we'd have to expose a whole new set of resources for "set-less" index endpoints, which meh.
		it('ought to give me a list of all pattern-rows in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/set/all/pattern/all/rows'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all samples in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/sample'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all patterns in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/set/all/pattern'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all pool-entries in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/set/all/poolEntry'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all songs in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/setSong'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all song-rows in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/setSong/all/songRows'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

		it('ought to give me a list of all test1 objects in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/test1'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-models']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});

	});
};
