var fs = require('fs');

module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	var testAssetPath = 'test/assets/test-wav.wav';
	var testAssetContentType = 'audio/wav';
	var testAssetSize = null;
	var testSampleId = null;
	describe('verify sample api', () => {
		it('should allow me to create a new sample', (done) => {
			fs.readFile(testAssetPath, (err, data) => {
				if (err) return done(err);
				testAssetSize = data.length;
				ctx.server.inject({
					method: 'post',
					url: '/api/sample',
					headers: {
						'content-type': testAssetContentType
					},
					payload: data
				}, (res) => {
					expect(res.statusCode).to.equal(200);
					expect(res.result.id).to.be.a.string();
					testSampleId = res.result.id;
					done();
				});
			});
		});
		it('should allow me to read the new sample back', (done) => {
			ctx.server.inject({
				method: 'get',
				url: '/api/sample/' + testSampleId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				// TODO: test payload size
				done();
			});
		});
		it('should allow me to delete the new sample', (done) => {
			ctx.server.inject({
				method: 'delete',
				url: '/api/sample/' + testSampleId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});
		it('should 404 if I try to delete the new sample again', (done) => {
			ctx.server.inject({
				method: 'delete',
				url: '/api/sample/' + testSampleId
			}, (res) => {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});

	});
};
