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

		it('should have correct pattern structure before deletes', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId;
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(1);
				expect(res.result.patterns[0].id).to.equal(patternId);
				ctx.server.inject({method: 'get', url: patternUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(1);
					expect(res.result.rows[0].id).to.equal(rowId);
					done();
				});
			});
		});

		var songId, songRowId;
		it('should allow me to create a simple test doc down to songrows', function(done) {
			var songUrl = treeOpsSetUrl + '/song';
			ctx.server.inject({method: 'post', url: songUrl, payload: {}}, function(res) {
				expect(res.statusCode).to.equal(200);
				songId = res.result.id;
				ctx.server.inject({method: 'post', url: songUrl + '/' + songId + '/songrow', payload: {}}, function(res) {
					expect(res.statusCode).to.equal(200);
					songRowId = res.result.id;
					done();
				});
			});
		});

		it('should have correct song structure before deletes', function(done) {
			var songUrl = treeOpsSetUrl + '/song/' + songId;
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.songs.length).to.equal(1);
				expect(res.result.songs[0].id).to.equal(songId);
				ctx.server.inject({method: 'get', url: songUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(1);
					expect(res.result.rows[0].id).to.equal(songRowId);
					done();
				});
			});
		});

		var poolEntryId;
		it('should allow me to create a poolentry', function(done) {
			var poolEntryUrl = treeOpsSetUrl + '/poolentry';
			ctx.server.inject({method: 'post', url: poolEntryUrl, payload: {}}, function(res) {
				expect(res.statusCode).to.equal(200);
				poolEntryId = res.result.id;
				done();
			});
		});

		it('should have correct poolentry structure before deletes', function(done) {
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.pool.length).to.equal(1);
				expect(res.result.pool[0].id).to.equal(poolEntryId);
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

		it('should have also deleted the song and the row', function(done) {
			var songUrl = treeOpsSetUrl + '/song/' + songId;
			var rowUrl = songUrl + '/songrow/' + songRowId;
			ctx.server.inject({method: 'get', url: songUrl}, function(res) {
				expect(res.statusCode).to.equal(404);
				ctx.server.inject({method: 'get', url: rowUrl}, function(res) {
					expect(res.statusCode).to.equal(404);
					done();
				});
			});
		});

		it('should have also deleted the poolentry', function(done) {
			var poolEntryUrl = treeOpsSetUrl + '/poolentry/' + poolEntryId;
			ctx.server.inject({method: 'get', url: poolEntryUrl}, function(res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});
	});

};
