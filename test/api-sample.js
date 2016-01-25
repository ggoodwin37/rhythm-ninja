module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	ctx.setName = 'reserved-test-set';
	ctx.baseSetUrl = '/api/set/' + ctx.setName;
	describe('verify sample api', function () {
		it('should allow me to create a new sample', function(done) {
			done();
		});
	});
};
