module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	describe('verify pool-entry api', function() {

		it('should start with an empty pool on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(0);
				done();
			});
		});

		var baseSetPoolUrl = ctx.baseSetUrl + '/poolentry';
		var poolEntryId1;
		it('should allow me to create a new poolEntry', function(done) {
			var poolEntry = {
				name: 'test-pool-entry-post',
				volume: 0.75,
				sampleType: 'local',
				sampleId: 'abcd-efgh'
			};
			ctx.server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.volume).to.equal(0.75);
				poolEntryId1 = res.result.id;
				done();
			});
		});

		it('should have added the new pool entry to the set for me', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(1);
				expect(res.result.pool[0].id).to.equal(poolEntryId1);
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl + '/poolentry/' + poolEntryId1}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.volume).to.equal(0.75);
					done();
				});
			});
		});

		var poolEntryId2;
		it('should allow me to create a second poolEntry', function(done) {
			var poolEntry = {
				name: 'test-pool-entry-post',
				volume: 0.5,
				sampleType: 'local',
				sampleId: 'abcd-efgh'
			};
			ctx.server.inject({method: 'post', url: baseSetPoolUrl, payload: JSON.stringify(poolEntry)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.volume).to.equal(0.5);
				poolEntryId2 = res.result.id;
				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('poolEntryId1: ' + poolEntryId1 + ' poolEntryId2: ' + poolEntryId2);
				}
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.pool.length).to.equal(2);
					expect(res.result.pool[1].id).to.equal(poolEntryId2);
					ctx.server.inject({method: 'get', url: ctx.baseSetUrl + '/poolentry/' + poolEntryId2}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.volume).to.equal(0.5);
						done();
					});
				});
			});
		});

		it('should allow me to delete the first poolEntry now', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should fail to delete the thing we just deleted', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetPoolUrl + '/' + poolEntryId1}, function(res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

		it('should have removed the deleted pool entry from the set', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(1);
				expect(res.result.pool[0].id).to.equal(poolEntryId2);
				done();
			});
		});
	});
};
