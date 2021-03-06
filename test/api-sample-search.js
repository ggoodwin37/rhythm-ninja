var fs = require('fs');
var async = require('async');
var StepList = require('../step-list');

module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	var testUserId = 'test_user_id_1';
	var otherUserId = 'test_user_id_2';
	var testAssetPaths = [
		'test/assets/test-wav-1.wav',
		'test/assets/test-wav-2.wav',
		'test/assets/test-wav-3.wav'
	];
	var testAssetContentType = 'audio/wav';
	var origNumSamples;
	var testSampleIds = null;
	var otherUserSampleId = null;
	describe('verify sample search api', () => {
		it('should let me check any existing samples', (done) => {
			ctx.server.inject({
				method: 'get',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.samples).to.be.an.array();
				origNumSamples = res.result.samples.length;
				done();
			});
		});
		it('should allow me to create a few samples', (done) => {
			const stepList = new StepList();
			testSampleIds = [];
			testAssetPaths.forEach(path => {
				stepList.addStep(cb => {
					fs.readFile(path, (err, data) => {
						if (err) return done(err);
						ctx.server.inject({
							method: 'post',
							url: '/api/sample',
							headers: {
								'content-type': testAssetContentType,
								'x-sample-name': 'api-sample-test-' + path,
								'x-under-test': '1'
							},
							payload: data
						}, (res) => {
							expect(res.statusCode).to.equal(200)
							testSampleIds.push(res.result.id);
							cb();
						});
					});
				});
			});
			stepList.execute(() => {
				expect(testSampleIds.length).to.equal(testAssetPaths.length);
				done();
			});
		});
		it('should serve me the sample info for all the samples my user has uploaded', (done) => {
			ctx.server.inject({
				method: 'get',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.samples).to.be.an.array();
				expect(res.result.samples.length).to.equal(testSampleIds.length + origNumSamples);
				done();
			});
		});
		it('should allow me to delete the samples I uploaded', (done) => {
			const stepList = new StepList();
			testSampleIds.forEach(thisId => {
				stepList.addStep(cb => {
					ctx.server.inject({
						method: 'delete',
						url: '/api/sample/' + thisId,
						headers: {
							'x-under-test': '1'
						}
					}, (res) => {
						expect(res.statusCode).to.equal(200)
						cb();
					});
				});
			});
			stepList.execute(() => {
				testSampleIds = [];
				done();
			});
		});
		it('should return 0 new items if I ask for my samples after deleting them', (done) => {
			ctx.server.inject({
				method: 'get',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.samples).to.be.an.array();
				expect(res.result.samples.length).to.equal(origNumSamples);
				done();
			});
		});
		it('should not post', (done) => {
			ctx.server.inject({
				method: 'post',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});
		it('should not delete', (done) => {
			ctx.server.inject({
				method: 'delete',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(404);
				done();
			});
		});
		it('should let me post another sample from a different user id.', done => {
			var path = testAssetPaths[0];
			fs.readFile(path, (err, data) => {
				if (err) return done(err);
				ctx.server.inject({
					method: 'post',
					url: '/api/sample',
					headers: {
						'content-type': testAssetContentType,
						'x-sample-name': 'api-sample-test-' + path,
						'x-under-test': '2'
					},
					payload: data
				}, (res) => {
					expect(res.statusCode).to.equal(200)
					otherUserSampleId = res.result.id;
					done();
				});
			});
		});
		it('should only return samples belonging to current user.', done => {
			ctx.server.inject({
				method: 'get',
				url: '/api/userSamples/' + testUserId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.samples).to.be.an.array();
				expect(res.result.samples.filter(sample => {
					return sample.id === otherUserSampleId;
				}).length).to.equal(0);
				done();
			});
		});
		it('should only return samples belonging to other user.', done => {
			ctx.server.inject({
				method: 'get',
				url: '/api/userSamples/' + otherUserId
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				expect(res.result.samples).to.be.an.array();
				expect(res.result.samples.filter(sample => {
					return sample.id === otherUserSampleId;
				}).length).to.equal(1);
				done();
			});
		});
		it('should not allow me to delete the otherUser sample as the first user', (done) => {
			ctx.server.inject({
				method: 'delete',
				url: '/api/sample/' + otherUserSampleId,
				headers: {
					'x-under-test': '1'
				}
			}, (res) => {
				expect(res.statusCode).to.equal(401);
				done();
			});
		});
		it('should allow me to delete the otherUser sample as the other user', (done) => {
			ctx.server.inject({
				method: 'delete',
				url: '/api/sample/' + otherUserSampleId,
				headers: {
					'x-under-test': '2'
				}
			}, (res) => {
				expect(res.statusCode).to.equal(200);
				done();
			});
		});

	});
};
