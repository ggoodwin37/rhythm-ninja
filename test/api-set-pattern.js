var async = require('async');

module.exports = function(ctx, lab) {
	// Test shortcuts
	var expect = require('code').expect;
	var before = lab.before;
	var after = lab.after;
	var describe = lab.experiment;
	var it = lab.test;

	describe('verify set deep population', function() {

		it('should delete any existing documents with the test name', function(done) {
			ctx.server.inject({
				method: 'delete',
				url: ctx.baseSetUrl
			}, function(res) {
				expect(res.statusCode == 200 || res.statusCode == 404).to.equal(true);
				done();
			});
		});

		it('should start with an empty pattern list on set endpoint', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				expect(res.result.patterns.length).to.equal(0);
				done();
			});
		});

		var baseSetPatternUrl = '/api/set/' + ctx.setName + '/pattern';
		var patternNames = ['test-set-patt-1', 'test-set-patt-2', 'test-set-patt-3'];
		var rows = [
			{
				poolEntry: 'some-pool-entry-1',
				steps: [1, 0, 0, 0, 1, 0, 0, 0.5]
			},
			{
				poolEntry: 'some-pool-entry-2',
				steps: [1, 0, 0, 0, 1, 0, 0, 0.75]
			},
			{
				poolEntry: 'some-pool-entry-3',
				steps: [1, 0, 0, 0, 1, 0, 0, 0.875]
			}
		];
		var patternIds = [];
		it('should allow me to create several new patterns', function(done) {
			var tasks = [];
			patternNames.forEach(function(patternName) {
				var thisPatternId;
				tasks.push(function(cb) {
					var patternData = {
						name: patternName,
						length: 8,
						locked: false
					};
					ctx.server.inject({method: 'post', url: baseSetPatternUrl, payload: JSON.stringify(patternData)}, function(res) {
						expect(res.statusCode).to.equal(200);
						expect(res.result.length).to.equal(8);
						thisPatternId = res.result.id;
						patternIds.push(thisPatternId);
						cb();
					});
				});

				rows.forEach(function(rowData) {
					tasks.push(function(cb) {
						var rowUrl = baseSetPatternUrl + '/' + thisPatternId + '/patternrow';
						ctx.server.inject({method: 'post', url: rowUrl, payload: JSON.stringify(rowData)}, function(res) {
							expect(res.statusCode).to.equal(200);
							cb();
						});
					});
				});
			});
			async.series(tasks, function(err, result) {
				expect(!!err).to.equal(false);
				done();
			});
		});

		var resSet;
		it('should have added the new patterns to the set for me', function(done) {
			ctx.server.inject({method: 'get', url: ctx.baseSetUrl}, function(res) {
				expect(res.statusCode).to.equal(200);
				resSet = res.result;
				expect(resSet.patterns.length).to.equal(patternNames.length);
				done();
			});
		});

		it('should have populated result set', function(done) {
			resSet.patterns.forEach(function(pattern) {
				expect(patternNames.some(function(name) {
					return name === pattern.name;
				})).to.equal(true);
				expect(pattern.length).to.equal(8);
			});
			expect(resSet.patterns[1].rows[2].poolEntry).to.equal('some-pool-entry-3');
			done();
		});

	});
};
