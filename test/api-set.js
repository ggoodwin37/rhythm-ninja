module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	ctx.setName = 'reserved-test-set';
	ctx.baseSetUrl = '/api/set/' + ctx.setName;
	ctx.setDoc;
	describe('verify set api', function () {

		it('should delete any existing documents with the test name', function(done) {
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
				expect(res.result.songs === undefined).to.equal(false);

				ctx.setDoc = res.result;
				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + ctx.setDoc.id);
				}

				done();
			});
		});

		it('should handle updates to set data', function(done) {
			ctx.setDoc.bpm = 161;
			ctx.server.inject({
				method: 'put',
				url: ctx.baseSetUrl,
				payload: {bpm: ctx.setDoc.bpm}
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.bpm).to.equal(161);
				expect(res.result.songs === undefined).to.equal(false);
				ctx.setDoc = res.result;
				done();
			});
		});

		it('should not have touched data that we didn\'t update', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.swing).to.equal(0.5);
				expect(res.result.songs === undefined).to.equal(false);
				done();
			});
		});

	});
};
