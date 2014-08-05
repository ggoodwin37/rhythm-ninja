module.exports = function(ctx) {
	var Lab = require('lab');
	var async = require('async');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	describe('race-order-bug', function() {

		it('should be cool to delete all pool entries', function(done) {
			ctx.getSet(function(res) {
				console.log('set has num entries: ' + res.result.pool.length);
				var taskList = [];
				res.result.pool.forEach(function(poolEntry) {
					taskList.push(function(callback) {
						ctx.server.inject({method: 'delete', url: ctx.baseSetUrl + '/poolEntry/' + poolEntry.key}, function(res) {
							expect(res.statusCode).to.equal(200);
							callback();
						});
					});
				});
				async.series(taskList, function() {
					done();
				});
			});
		});

		it('is now a smoldering hole in the ground', function(done) {
			ctx.getSet(function(res) {
				if (res.result.pool.length >= 1) console.log(res.result.pool[0].key);
				expect(res.result.pool.length).to.equal(0);
				done();
			});
		});

		var numTries = 100;
		it('will now try to reproduce the race condition with n=' + numTries, function(done) {
			function runloop() {
				var entryId1, entryId2;
				async.series([
					function(callback) {
						ctx.server.inject({method: 'post', url: ctx.baseSetUrl + '/poolEntry'}, function(res) {
							expect(res.statusCode).to.equal(200);
							entryId1 = res.result.key;
							callback();
						});
					},
					function(callback) {
						ctx.server.inject({method: 'post', url: ctx.baseSetUrl + '/poolEntry'}, function(res) {
							expect(res.statusCode).to.equal(200);
							entryId2 = res.result.key;
							callback();
						});
					},
					function(callback) {
						ctx.getSet(function(res) {
							expect(res.result.pool.length).to.equal(2);
							callback();
						});
					},
					function(callback) {
						ctx.server.inject({method: 'delete', url: ctx.baseSetUrl + '/poolEntry/' + entryId1}, function(res) {
							expect(res.statusCode).to.equal(200);
							callback();
						});
					}
				], function() {
					ctx.getSet(function(res) {
						expect(res.result.pool.length).to.equal(1);
						expect(res.result.pool[0].key).to.equal(entryId2);
						
						tryNextLoop();
					});
				});
			};

			// this actually sucks. is there a way to call an async function N times without eating up stack?
			function tryNextLoop() {
				if (--counter > 0) {
					setTimeout(runLoop, 0);
				} else {
					done();
				}
			}

			var counter = numTries;
			runloop();
		});
	});
};
