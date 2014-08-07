module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('set-api-song', function() {

		it('should start with an empty song on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.song.rows.length).to.equal(0);
				ctx.setDoc = res.result;
				done();
			});
		});

		var baseSetSongUrl = '/api/setSong/' + ctx.setName;

		it('can modify song-level data', function(done) {
			expect(ctx.setDoc.song.locked).to.equal(false);
			ctx.server.inject({method: 'put', url: baseSetSongUrl, payload: {locked: true}}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.locked).to.equal(true);
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.song.locked).to.equal(true);
					done();
				});
			});
		});

		var songRowId1;
		it('handles adding a song row', function(done) {
			var songRowData = {
				patternId: 'some-pattern',
				offset: 1,
				len: 2,
				count: 3
			};
			ctx.server.inject({method: 'post', url: baseSetSongUrl + '/songRows', payload: songRowData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.offset).to.equal(1);
				expect(res.result.count).to.equal(3);
				songRowId1 = res.result.id;
				done();
			});
		});

		it('should update set and song when I do that', function(done) {
			ctx.server.inject({method: 'get', url: baseSetSongUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(1);
				expect(res.result.rows[0].len).to.equal(2);
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.song.rows.length).to.equal(1);
					expect(res.result.song.rows[0].patternId).to.equal('some-pattern');
					done();
				});
			});
		});

		var songRowId2;
		it('handles adding another song row', function(done) {
			var songRowData = {
				patternId: 'some-other-pattern',
				offset: 11,
				len: 22,
				count: 33
			};
			ctx.server.inject({method: 'post', url: baseSetSongUrl + '/songRows', payload: songRowData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.offset).to.equal(11);
				expect(res.result.count).to.equal(33);
				songRowId2 = res.result.id;
				done();
			});
		});

		it('doesn\'t mind deleting the first song row', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetSongUrl + '/songRows/' + songRowId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should update set view of song after deleting that row', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.song.rows.length).to.equal(1);
				expect(res.result.song.rows[0].id).to.equal(songRowId2);
				done();
			});
		});

		it('should 404 when trying to delete the thing we just deleted', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetSongUrl + '/songRows/' + songRowId1}, function(res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

		it('should handle updates to a songRow', function(done) {
			var updatedData = {
				len: 55
			};
			ctx.server.inject({method: 'put', url: baseSetSongUrl + '/songRows/' + songRowId2, payload: JSON.stringify(updatedData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: baseSetSongUrl + '/songRows/' + songRowId2}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.patternId).to.equal('some-other-pattern');
					expect(res.result.len).to.equal(55);
					ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.song.rows[0].len).to.equal(55);
						done();
					});
				});
			});
		});

	});

};
