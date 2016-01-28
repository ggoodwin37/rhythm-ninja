module.exports = function(ctx, lab) {
	var async = require('async');

	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	var treeOpsSetName = 'reserved-test-set-step-updates';
	var treeOpsSetUrl = '/api/set/' + treeOpsSetName;

	describe('verify that we do the right thing when updating a row step:', function () {

		it('should delete any existing documents with the test name ' + treeOpsSetName, function(done) {
			ctx.server.inject({
				method: 'delete',
				url: treeOpsSetUrl
			}, function(res) {
				expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
				done();
			});
		});

		it('should lazy create and return a new document', function(done) {
			ctx.server.inject({
				method: 'get',
				url: treeOpsSetUrl
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an.object();
				expect(res.result.name).to.equal(treeOpsSetName);
				expect(res.result.songs === undefined).to.equal(false);

				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + res.result.id);
				}

				done();
			});
		});

		var patternId, rowId;
		var patternData = {
			name: 'test-pattern-for-step-update',
			length: 8,
			locked: false
		};
		var rowData = {
			poolEntry: 'some-pool-entry-for-updating-1',
			steps: [1, 0, 0.25, 0, 1, 0, 0, 0]
		};
		var patternRowUrl;
		it('should allow me to create a simple test doc down to patternrows', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern';
			ctx.server.inject({method: 'post', url: patternUrl, payload: patternData}, function(res) {
				expect(res.statusCode).to.equal(200);
				patternId = res.result.id;
				ctx.server.inject({method: 'post', url: patternUrl + '/' + patternId + '/patternrow', payload: rowData},
								  function(res) {
					expect(res.statusCode).to.equal(200);
					rowId = res.result.id;
					patternRowUrl = patternUrl + '/' + patternId + '/patternrow/' + rowId;
					done();
				});
			});
		});

		var patternRowModel;
		it('set should look right', function(done) {
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns[0].rows[0].steps[2]).to.equal(0.25);
				patternRowModel = res.result.patterns[0].rows[0];
				done();
			});
		});

		it('should be able to update a step via patternRow PUT', function(done) {
			patternRowModel.steps[2] = 0.5;
			ctx.server.inject({method: 'put', url: patternRowUrl, payload: patternRowModel}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		var patternModel;
		it('set should look right after patternRow update', function(done) {
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns[0].rows.length).to.equal(1);
				expect(res.result.patterns[0].rows[0].steps[0]).to.equal(1);
				expect(res.result.patterns[0].rows[0].steps[1]).to.equal(0);
				expect(res.result.patterns[0].rows[0].steps[2]).to.equal(0.5);
				patternModel = res.result.patterns[0];
				done();
			});
		});

		it('should be able to update a step via pattern PUT', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId;
			patternModel.rows[0].steps[1] = 0.25;
			ctx.server.inject({method: 'put', url: patternUrl, payload: patternModel}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('set should look right after pattern update', function(done) {
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns[0].rows.length).to.equal(1);
				expect(res.result.patterns[0].rows[0].steps[0]).to.equal(1);
				expect(res.result.patterns[0].rows[0].steps[1]).to.equal(0.25);
				expect(res.result.patterns[0].rows[0].steps[2]).to.equal(0.5);
				patternModel = res.result.patterns[0];
				done();
			});
		});

		it('should allow me to delete the set', function(done) {
			ctx.server.inject({method: 'delete', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should have also deleted the pattern and the row', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId;
			var rowUrl = patternUrl + '/patternrow/' + rowId;
			ctx.server.inject({method: 'get', url: patternUrl}, function(res) {
				expect(res.statusCode).to.equal(404);
				ctx.server.inject({method: 'get', url: rowUrl}, function(res) {
					expect(res.statusCode).to.equal(404);
					done();
				});
			});
		});

	});

};
