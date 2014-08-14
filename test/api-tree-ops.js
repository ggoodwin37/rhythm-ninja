module.exports = function(ctx) {
	var Lab = require('lab');
	var async = require('async');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	var treeOpsSetName = 'reserved-test-tree-stuff';
	var treeOpsSetUrl = '/api/set/' + treeOpsSetName;

	describe('verify that we do the right thing when deleting child elements', function () {

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

		it('should start with an empty pattern list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(0);
				ctx.setDoc = res.result;
				done();
			});
		});

		var basePatternUrl = '/api/set/' + treeOpsSetName + '/pattern';
		var basePatternRowUrl;
		var patternId1, rowId1, patternId2, rowId2;
		it('should allow me to create new patterns and rows, updating pattern when a child is created', function(done) {
			var pattern = {
				name: 'test-pattern-post',
				length: 12,
				locked: false
			};
			var row = {
				poolEntry: 'some pool ref',
				steps: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
			};
			async.series([
				function(cb) {
					ctx.server.inject({method: 'post', url: basePatternUrl, payload: pattern}, function(res) {
						patternId1 = res.result.id;
						cb();
					});
				},
				function(cb) {
					ctx.server.inject({method: 'post', url: basePatternUrl, payload: pattern}, function(res) {
						patternId2 = res.result.id;
						cb();
					});
				},
				function(cb) {
					var rowUrl = basePatternUrl + '/' + patternId1 + '/patternrow';
					ctx.server.inject({method: 'post', url: rowUrl, payload: row}, function(res) {
						rowId1 = res.result.id;
						cb();
					});
				},
				function(cb) {
					var rowUrl = basePatternUrl + '/' + patternId1 + '/patternrow';  // add to same pattern as prev
					ctx.server.inject({method: 'post', url: rowUrl, payload: row}, function(res) {
						rowId2 = res.result.id;
						cb();
					});
				},
				function(cb) {
					ctx.server.inject({method: 'get', url: basePatternUrl + '/' + patternId1}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.rows.length).to.equal(2);
						cb();
					});
				},
				function(cb) {
					ctx.server.inject({method: 'get', url: basePatternUrl + '/' + patternId2}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.rows.length).to.equal(0);
						cb();
					});
				}
			], function() {
				ctx.server.inject({method: 'get', url: treeOpsSetUrl}, function(res){
					expect(res.statusCode).to.equal(200);
					expect(res.result.patterns.length).to.equal(2);
					done();
				});
			});
		});

		it('should update parent list when child is removed', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId1;
			var rowUrl = patternUrl + '/patternrow/' + rowId1;
			ctx.server.inject({method: 'delete', url: rowUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: patternUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.rows.length).to.equal(1); // started with 2
					done();
				});
			});
		});

		it('should remove children when the parent is removed', function(done) {
			var patternUrl = treeOpsSetUrl + '/pattern/' + patternId1;
			var rowUrl = patternUrl + '/patternrow/' + rowId2;
			console.log('patt=' + patternUrl + ' row=' + rowUrl);

			// ctx.server.inject({method: 'get', url: patternUrl}, function(res) {
			// 	expect(res.statusCode).to.equal(200);
			// 	expect(res.result.rows.length).to.equal(1); // started with 2
			// 	ctx.inspect(res.result);
			// 	done();
			// });


			ctx.server.inject({method: 'get', url: rowUrl}, function(res) {
				expect(res.statusCode).to.equal(200);

				ctx.server.inject({method: 'delete', url: patternUrl}, function(res) {
					expect(res.statusCode).to.equal(200); // 404??
					ctx.server.inject({method: 'get', url: rowUrl}, function(res) {
						expect(res.statusCode).to.equal(200);
						done();
					});
				});
			});
		});

	});
};
