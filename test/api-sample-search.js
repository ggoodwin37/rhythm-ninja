var fs = require('fs');

module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	var testAssetPath = 'test/assets/test-wav-1.wav';
	var testAssetContentType = 'audio/wav';
	var testAssetSize = null;
	var testSampleId = null;
	describe('verify sample search api', () => {
		it('should allow me to create a few samples', (done) => {
			// fs.readFile(testAssetPath, (err, data) => {
			// 	if (err) return done(err);
			// 	testAssetSize = data.length;
			// 	ctx.server.inject({
			// 		method: 'post',
			// 		url: '/api/sample',
			// 		headers: {
			// 			'content-type': testAssetContentType,
			// 			'x-sample-name': 'api-sample-test',
			// 			'x-under-test': true
			// 		},
			// 		payload: data
			// 	}, (res) => {
			// 		expect(res.statusCode).to.equal(200);
			// 		expect(res.result.id).to.be.a.string();
			// 		testSampleId = res.result.id;
			// 		done();
			// 	});
			// });
			done();
		});
		it('should serve me the sample info for all the samples my user has uploaded', (done) => {
			// ctx.server.inject({
			// 	method: 'get',
			// 	url: '/api/sample/' + testSampleId
			// }, (res) => {
			// 	expect(res.statusCode).to.equal(200);
			// 	expect(res.headers['content-type']).to.equal(testAssetContentType);
			// 	expect(res.headers['content-length']).to.equal(testAssetSize);
			// 	expect(res.rawPayload.length).to.equal(testAssetSize);
			// 	done();
			// });
			done();
		});
		it('should allow me to delete the samples I uploaded', (done) => {
			// ctx.server.inject({
			// 	method: 'delete',
			// 	url: '/api/sample/' + testSampleId
			// }, (res) => {
			// 	expect(res.statusCode).to.equal(200);
			// 	done();
			// });
			done();
		});
		it('should return 0 items if I ask for my samples after deleting them', (done) => {
			// ctx.server.inject({
			// 	method: 'delete',
			// 	url: '/api/sample/' + testSampleId
			// }, (res) => {
			// 	expect(res.statusCode).to.equal(404);
			// 	done();
			// });
			done();
		});

	});
};
