module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('set-api-set-index', function() {
		it('really ought to give me a list of all sets in the db', function(done) {
			ctx.server.inject({method: 'get', url: '/api/set'}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('array');

				if (ctx.app.config.logThings['test--show-all-sets']) {
					ctx.inspect(res.result);
				}

				done();
			});
		});
	});

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
				if(ctx.app.config.logThings['test--all-api-routes']) {
					console.log('client sees key: ' + ctx.setDoc.key);
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

	});
};
