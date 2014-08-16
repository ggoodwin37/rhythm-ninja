module.exports = function(ctx) {
	var Lab = require('lab');
	var async = require('async');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	var treeOpsSetName = 'reserved-test-set-tree-stuff';
	var treeOpsSetUrl = '/api/set/' + treeOpsSetName;

	describe('verify that we do the right thing when deleting a set', function () {

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
				expect(res.result).to.be.an('object');
				expect(res.result.name).to.equal(treeOpsSetName);
				expect(res.result.songs === undefined).to.equal(false);

				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + res.result.id);
				}

				done();
			});
		});

		var patternId, rowId;
		it('should allow me to create a simple test doc down to patternrows', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern';
			ctx.server.inject({method: 'post', url: patternUrl, payload: {}}, function(res) {
				expect(res.statusCode).to.equal(200);
				patternId = res.result.id;
				ctx.server.inject({method: 'post', url: patternUrl + '/' + patternId + '/patternrow', payload: {}}, function(res) {
					expect(res.statusCode).to.equal(200);
					rowId = res.result.id;
					done();
				});
			});
		});

		it('should have correct structure before deletes', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId;
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0]).to.equal(patternId);
				ctx.server.inject({method: 'get', url: patternUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(1);
					expect(res.result.rows[0]).to.equal(rowId);
					done();
				});
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
