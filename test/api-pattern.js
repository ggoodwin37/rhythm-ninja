module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	describe('verify pattern and patternrow api', function() {

		it('should start with an empty pattern list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(0);
				done();
			});
		});

		var baseSetPatternUrl = '/api/set/' + ctx.setName + '/pattern';
		var patternId1;
		it('should allow me to create a new pattern', function(done) {
			var pattern = {
				name: 'test-pattern-post',
				length: 12,
				locked: false
			};
			ctx.server.inject({method: 'post', url: baseSetPatternUrl, payload: JSON.stringify(pattern)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.length).to.equal(12);
				patternId1 = res.result.id;
				done();
			});
		});

		it('should create patterns without any rows initially', function(done) {
			ctx.server.inject({method: 'get', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.length).to.equal(12);
				expect(res.result.rows.length).to.equal(0);
				done();
			});
		});

		it('should have added the new pattern to the set for me', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0].id).to.equal(patternId1);
				done();
			});
		});

		var patternId2;
		it('should allow me to create a second pattern', function(done) {
			var pattern = {
				name: 'test-pattern-post-2',
				length: 14,
				locked: false
			};
			ctx.server.inject({method: 'post', url: baseSetPatternUrl, payload: JSON.stringify(pattern)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.length).to.equal(14);
				patternId2 = res.result.id;
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.patterns.length).to.equal(2);
					expect(res.result.patterns[1].id).to.equal(patternId2);
					done();
				});
			});
		});

		it('should allow me to delete the first pattern', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should fail to delete the thing we just deleted', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetPatternUrl + '/' + patternId1}, function(res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

		it('should have removed the deleted pattern from the set', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0].id).to.equal(patternId2);
				done();
			});
		});

		it('should allow us to modify an existing pattern metadata (not row)', function(done) {
			var patternData = {
				name: 'pattern-updated',
				length: 16
			};
			var url = baseSetPatternUrl + '/' + patternId2;
			ctx.server.inject({method: 'put', url: url, payload: JSON.stringify(patternData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: url}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.length).to.equal(16);
					expect(res.result.name).to.equal('pattern-updated');
					done();
				});
			});
		});

		var baseSetPatternRowUrl;
		var patternRowId1;
		it('should accept a new pattern row', function(done) {
			baseSetPatternRowUrl = baseSetPatternUrl + '/' + patternId2 + '/patternrow';
			var rowData = {
				poolEntry: 'test-pool-entry',
				steps: [0, 101, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
			};
			ctx.server.inject({method: 'post', url: baseSetPatternRowUrl, payload: JSON.stringify(rowData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.poolEntry).to.equal('test-pool-entry');
				expect(res.result.steps.length).to.equal(16);
				expect(res.result.steps[1]).to.equal(101);
				patternRowId1 = res.result.id;
				done();
			});
		});

		it('should let me edit an existing pattern row', function(done) {
			var rowData = {
				steps: [0, 1, 22, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
			};
			var url = baseSetPatternRowUrl + '/' + patternRowId1;
			ctx.server.inject({method: 'put', url: url, payload: JSON.stringify(rowData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: url}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.poolEntry).to.equal('test-pool-entry');
					expect(res.result.steps.length).to.equal(16);
					expect(res.result.steps[2]).to.equal(22);
					done();
				});
			});
		});

		var patternRowId2;
		it('should accept a second pattern row', function(done) {
			if(ctx.app.config.logThings['test--list-collections']) {
				console.log('patternId1: ' + patternId1 + ' patternId2: ' + patternId2);
			}
			baseSetPatternRowUrl = baseSetPatternUrl + '/' + patternId2 + '/patternrow';
			var rowData = {
				poolEntry: 'test-pool-entry-2',
				length: 2,
				steps: [9, 8]  // not consistent since pattern now has length 16, but not expecting any code to catch this yet.
			};
			ctx.server.inject({method: 'post', url: baseSetPatternRowUrl, payload: JSON.stringify(rowData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.poolEntry).to.equal('test-pool-entry-2');
				expect(res.result.steps.length).to.equal(2);
				expect(res.result.steps[1]).to.equal(8);
				patternRowId2 = res.result.id;
				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('patternRowId1: ' + patternRowId1 + ' patternRowId2: ' + patternRowId2);
				}
				ctx.server.inject({method: 'get', url: baseSetPatternUrl + '/' + patternId2}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(2);
					done();
				});
			});
		});

		it('should let me delete the first pattern row', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetPatternRowUrl + '/' + patternRowId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: baseSetPatternUrl + '/' + patternId2}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(1);
					expect(res.result.rows[0].id).to.equal(patternRowId2);
					done();
				});
			});
		});

	});
};
