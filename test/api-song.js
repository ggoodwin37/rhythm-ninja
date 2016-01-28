module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	describe('verify song api', function() {

		it('should start with an empty song list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.songs.length).to.equal(0);
				done();
			});
		});

		var baseSetSongUrl = ctx.baseSetUrl + '/song';
		var song1Id;
		it('lets me create a song', function(done) {
			var songData = {
				name: 'test-song',
				locked: false
			};
			ctx.server.inject({method: 'post', url: baseSetSongUrl, payload: songData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.name).to.equal('test-song');
				song1Id = res.result.id;
				ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.songs.length).to.equal(1);
					expect(res.result.songs[0].id).to.equal(song1Id);
					done();
				});
			});
		});

		it('can modify song-level data', function(done) {
			ctx.server.inject({method: 'put', url: baseSetSongUrl + '/' + song1Id, payload: {locked: true}}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: baseSetSongUrl + '/' + song1Id}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.locked).to.equal(true);
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
			ctx.server.inject({method: 'post', url: baseSetSongUrl + '/' + song1Id + '/songrow', payload: songRowData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.offset).to.equal(1);
				expect(res.result.count).to.equal(3);
				songRowId1 = res.result.id;
				done();
			});
		});

		it('should update set and song when I do that', function(done) {
			ctx.server.inject({method: 'get', url: baseSetSongUrl + '/' + song1Id}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(1);
				expect(res.result.rows[0].id).to.equal(songRowId1);
				done();
			});
		});

		var songRowId2;
		it('handles adding another song row', function(done) {
			var songRowData = {
				pattern_id: 'some-other-pattern',
				offset: 11,
				len: 22,
				count: 33
			};
			ctx.server.inject({method: 'post', url: baseSetSongUrl + '/' + song1Id + '/songrow', payload: songRowData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.offset).to.equal(11);
				expect(res.result.count).to.equal(33);
				expect(res.result.pattern_id).to.equal('some-other-pattern');
				songRowId2 = res.result.id;
				done();
			});
		});

		it('doesn\'t mind deleting the first song row', function(done) {
			ctx.server.inject({method: 'delete', url: baseSetSongUrl + '/' + song1Id + '/songrow/' + songRowId1}, function(res) {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

		it('should update song after deleting that row', function(done) {
			ctx.server.inject({method: 'get', url: baseSetSongUrl + '/' + song1Id }, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.rows.length).to.equal(1);
				expect(res.result.rows[0].id).to.equal(songRowId2);
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
			ctx.server.inject({method: 'put', url: baseSetSongUrl + '/' + song1Id + '/songrow/' + songRowId2, payload: JSON.stringify(updatedData)}, function(res) {
				expect(res.statusCode).to.equal(200);
				ctx.server.inject({method: 'get', url: baseSetSongUrl + '/' + song1Id + '/songrow/' + songRowId2}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.pattern_id).to.equal('some-other-pattern');
					expect(res.result.len).to.equal(55);
					done();
				});
			});
		});

	});

};
