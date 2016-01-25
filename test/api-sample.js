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
					done();
				});
			});
		});
	});
};
