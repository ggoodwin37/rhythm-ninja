module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	ctx.setName = 'reserved-test-asdjfjjadsfh';
	ctx.baseSetUrl = '/api/set/' + ctx.setName;
	ctx.setDoc;
	describe('set-api-set', function () {

		it('should delete any existing test documents', function(done) {
			ctx.server.inject({
				method: 'delete',
				url: ctx.baseSetUrl
			}, function(res) {
				expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
				done();
			});
		});

		it('should fail to delete a non-existent document', function(done) {
			ctx.server.inject({
				method: 'delete',
				url: ctx.baseSetUrl
			}, function(res) {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

		it('should lazy create and return a new document', function(done) {
			ctx.server.inject({
				method: 'get',
				url: ctx.baseSetUrl
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.name).to.equal(ctx.setName);
				expect(res.result.song === undefined).to.equal(false);

				ctx.setDoc = res.result;
				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + ctx.setDoc.id);
				}

				done();
			});
		});

		it('should handle updates to set data', function(done) {
			ctx.setDoc.setInfo.bpm = 160;
			ctx.server.inject({
				method: 'put',
				url: ctx.baseSetUrl,
				payload: {setInfo: ctx.setDoc.setInfo}
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.setInfo.bpm).to.equal(160);
				expect(res.result.song === undefined).to.equal(false);
				ctx.setDoc = res.result;
				done();
			});
		});

		it('should not have touched data that we didn\'t update', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.song === undefined).to.equal(false);
				done();
			});
		});

		it('should allow me to crud a set-info directly', function(done) {
			var setInfoData = {
				swing: 0.6,
				bpm: 95
			};
			ctx.server.inject({method: 'post', url: '/api/setInfo', payload: setInfoData}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.bpm).to.equal(95);
				var setInfoId = res.result.id;
				ctx.server.inject({method: 'put', url: '/api/setInfo/' + setInfoId, payload: {bpm: 88}}, function(res) {
					expect(res.statusCode).to.equal(200);
					ctx.server.inject({method: 'get', url: '/api/setInfo/' + setInfoId}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.id).to.equal(setInfoId);
						expect(res.result.bpm).to.equal(88);
						ctx.server.inject({method: 'delete', url: '/api/setInfo/' + setInfoId}, function(res) {
							expect(res.statusCode).to.equal(200);
							ctx.server.inject({method: 'get', url: '/api/setInfo/' + setInfoId}, function(res) {
								expect(res.statusCode).to.equal(404);
								done();
							});
						});
					});
				});
			});
		});

	});
};
