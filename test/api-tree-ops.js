module.exports = function(ctx) {
	var Lab = require('lab');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	var treeOpsSetName = 'reserved-test-tree-stuff';
	ctx.treeOps = {
		setUrl: '/api/set/' + treeOpsSetName
	};

	describe('verify that we do the right thing when deleting child elements', function () {

		it('should delete any existing documents with the test name ' + ctx.treeOps.setName, function(done) {
			ctx.server.inject({
				method: 'delete',
				url: ctx.treeOps.setUrl
			}, function(res) {
				expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
				done();
			});
		});

		it('should lazy create and return a new document', function(done) {
			ctx.server.inject({
				method: 'get',
				url: ctx.treeOps.setUrl
			}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result).to.be.an('object');
				expect(res.result.name).to.equal(treeOpsSetName);
				expect(res.result.songs === undefined).to.equal(false);

				if(ctx.app.config.logThings['test--list-collections']) {
					console.log('client sees set id: ' + res.result.id);
				}

				done();
			});
		});

		it('should start with an empty pattern list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.treeOps.setUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(0);
				ctx.setDoc = res.result;
				done();
			});
		});

		var basePatternUrl = '/api/set/' + treeOpsSetName + '/pattern';
		var basePatternRowUrl;
		var patternId1, rowId1;
		it('should allow me to create a new pattern and row', function(done) {
			var pattern = {
				name: 'test-pattern-post',
				length: 12,
				locked: false
			};
			ctx.server.inject({method: 'post', url: basePatternUrl, payload: JSON.stringify(pattern)}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.length).to.equal(12);
				patternId1 = res.result.id;
				basePatternRowUrl = basePatternUrl + '/' + patternId1 + '/patternrow';
				var row = {
					poolEntry: 'my-pool-entry',
					steps: [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
				};
				ctx.server.inject({method: 'post', url: basePatternRowUrl, payload: row}, function(res) {
					expect(res.statusCode).to.equal(200);
					expect(res.result.poolEntry).to.equal('my-pool-entry');
					rowId1 = res.result.id;
					ctx.server.inject({method: 'get', url: basePatternUrl + '/' + patternId1}, function(res){
						expect(res.statusCode).to.equal(200);
						expect(res.result.rows.length).to.equal(1);
						expect(res.result.rows[0].id).to.equal(rowId1);
						done();
					});
				});
			});
		});
	});
};
