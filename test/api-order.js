module.exports = function(ctx) {
	var Lab = require('lab');
	var async = require('async');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	var orderSetName = 'reserved-test-order-stuff';
	var orderSetUrl = '/api/set/' + orderSetName;

	describe('verify that we handle child order updates correctly', function () {

		it('should delete any existing documents with the test name ' + orderSetName, function(done) {
			ctx.server.inject({
				method: 'delete',
				url: orderSetUrl
			}, function(res) {
				expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
				done();
			});
		});

		it('should lazy create and return a new document', function(done) {
			ctx.server.inject({
				method: 'get',
				url: orderSetUrl
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.name).to.equal(orderSetName);
				expect(res.result.songs === undefined).to.equal(false);

				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + res.result.id);
				}

				done();
			});
		});

		it('should start with an empty pattern list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: orderSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(0);
				done();
			});
		});

		var basePatternUrl = '/api/set/' + orderSetName + '/pattern';
		var basePatternRowUrl;
		var patternId, rowId1, rowId2;
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
						patternId = res.result.id;
						cb();
					});
				},
				function(cb) {
					var rowUrl = basePatternUrl + '/' + patternId + '/patternrow';
					ctx.server.inject({method: 'post', url: rowUrl, payload: row}, function(res) {
						rowId1 = res.result.id;
						cb();
					});
				},
				function(cb) {
					var rowUrl = basePatternUrl + '/' + patternId + '/patternrow';  // add to same pattern as prev
					ctx.server.inject({method: 'post', url: rowUrl, payload: row}, function(res) {
						rowId2 = res.result.id;
						cb();
					});
				},
				function(cb) {
					ctx.server.inject({method: 'get', url: basePatternUrl + '/' + patternId}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.rows.length).to.equal(2);
						cb();
					});
				}
			], function() {
				ctx.server.inject({method: 'get', url: orderSetUrl}, function(res){
					expect(res.statusCode).to.equal(200);
					expect(res.result.patterns.length).to.equal(1);
					done();
				});
			});
		});

		it('should have the pattern rows in the same order I created them', function(done) {
			ctx.server.inject({method: 'get', url: basePatternUrl + '/' + patternId}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(2);
				expect(res.result.rows[0].id).to.equal(rowId1);
				expect(res.result.rows[1].id).to.equal(rowId2);
				done();
			});
		});

		it('should allow me to update the order of the rows', function(done) {
			var updateData = {
				rows: [rowId2, rowId1]
			};
			var url = basePatternUrl + '/' + patternId;
			ctx.server.inject({method: 'put', url: url, payload: updateData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(2);
				expect(res.result.rows[0].id).to.equal(rowId2);
				expect(res.result.rows[1].id).to.equal(rowId1);
				done();
			});
		});

		// do similar set of tests for song
		it('should start with an empty song list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: orderSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.songs.length).to.equal(0);
				done();
			});
		});

		var baseSongUrl = '/api/set/' + orderSetName + '/song';
		var baseSongRowUrl;
		var songId, songRowId1, songRowId2;
		it('should allow me to create new songs and songrows, updating pattern when a child is created', function(done) {
			var song = {
				name: 'test-song-post',
				locked: false
			};
			var songRow = {
				patternId: 'some-pattern',
				offset: 0,
				len: 8,
				count: 1
			};
			async.series([
				function(cb) {
					ctx.server.inject({method: 'post', url: baseSongUrl, payload: song}, function(res) {
						songId = res.result.id;
						cb();
					});
				},
				function(cb) {
					var songRowUrl = baseSongUrl + '/' + songId + '/songrow';
					ctx.server.inject({method: 'post', url: songRowUrl, payload: songRow}, function(res) {
						songRowId1 = res.result.id;
						cb();
					});
				},
				function(cb) {
					var songRowUrl = baseSongUrl + '/' + songId + '/songrow';  // add to same song as prev
					ctx.server.inject({method: 'post', url: songRowUrl, payload: songRow}, function(res) {
						songRowId2 = res.result.id;
						cb();
					});
				},
				function(cb) {
					ctx.server.inject({method: 'get', url: baseSongUrl + '/' + songId}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.rows.length).to.equal(2);
						cb();
					});
				}
			], function() {
				ctx.server.inject({method: 'get', url: orderSetUrl}, function(res){
					expect(res.statusCode).to.equal(200);
					expect(res.result.songs.length).to.equal(1);
					done();
				});
			});
		});

		it('should have the song rows in the same order I created them', function(done) {
			ctx.server.inject({method: 'get', url: baseSongUrl + '/' + songId}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(2);
				expect(res.result.rows[0].id).to.equal(songRowId1);
				expect(res.result.rows[1].id).to.equal(songRowId2);
				done();
			});
		});

		it('should allow me to update the order of the rows', function(done) {
			var updateData = {
				rows: [songRowId2, songRowId1]
			};
			var url = baseSongUrl + '/' + songId;
			ctx.server.inject({method: 'put', url: url, payload: updateData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(2);
				expect(res.result.rows[0].id).to.equal(songRowId2);
				expect(res.result.rows[1].id).to.equal(songRowId1);
				done();
			});
		});

	});
};
