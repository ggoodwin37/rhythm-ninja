module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('test-api', function () {
		var test1Id;
		var test1Name = 'test-name-content';

		it('has expected routes', function(done) {
			var expectedRoutes = [
				'get /api/test1/{test1_id}',
				'put /api/test1/{test1_id}',
				'delete /api/test1/{test1_id}',
				'post /api/test1'
			];
			expectedRoutes.forEach(function(expectedRoute) {
				expect(ctx.table.some(function(route) {
					return ctx.getRouteKey(route) == expectedRoute;
				})).to.equal(true);
			});
			done();
		});

		// this test is causing a count leak, huh? using -l when running tests to avoid this.
		it('can create a test1 object', function (done) {
			ctx.server.inject({
				method: 'post',
				url: '/api/test1',
				payload: JSON.stringify({testField: test1Name})
			}, function (res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.testField).to.equal(test1Name);
				test1Id = res.result.id;
				done();
			});
		});

		it('can retrieve test1 object', function (done) {
			ctx.server.inject({
				method: 'get',
				url: '/api/test1/' + test1Id
			}, function (res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.testField).to.equal(test1Name);
				done();
			});
		});

		it('can update test1 object', function (done) {
			ctx.server.inject({
				method: 'put',
				url: '/api/test1/' + test1Id,
				payload: JSON.stringify({testField: test1Name + 'mod'})
			}, function (res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.testField).to.equal(test1Name + 'mod');
				done();
			});
		});

		it('should not delete non-existent object', function (done) {
			ctx.server.inject({
				method: 'delete',
				url: '/api/test1/' + 'bogus'
			}, function (res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

		it('can delete test1 object', function (done) {
			ctx.server.inject({
				method: 'delete',
				url: '/api/test1/' + test1Id
			}, function (res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should not find the object we just deleted', function (done) {
			ctx.server.inject({
				method: 'get',
				url: '/api/test1/' + test1Id
			}, function (res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});
	});

};
