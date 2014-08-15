module.exports = function(ctx) {
	var Lab = require('lab');
	var inspect = require('eyes').inspector({maxLength: null});
	var mongoose = require('mongoose');

	// Test shortcuts
	var expect = Lab.expect;
	var before = Lab.before;
	var after = Lab.after;
	var describe = Lab.experiment;
	var it = Lab.test;

	var mongooseStarted = false;

	before(function(done) {
		// TODO: shared setup?
		done();
	});

	describe('basic mongoose stuff', function() {

		it('should be able to call mongoose.connect', function(done) {
			mongoose.connect('mongodb://localhost/ggtest');

			var db = mongoose.connection;
			db.on('error', function(err) {
				console.log('connection error: ' + err);
				done();
			});
			db.once('open', function callback () {
				mongooseStarted = true;
				done();
			});
		});

		var personFactory;
		it('should be able to create a schema, factory, and instance', function(done) {
			expect(mongooseStarted).to.equal(true);
			var personSchema = mongoose.Schema({
				name: {type: String, default: 'name'},
				age: {type: Number, default: 1}
			});
			personFactory = mongoose.model('test-person', personSchema);
			var person = new personFactory({name: 'bob'});
			person.save(function(err) {
				expect(!err).to.equal(true);
				done();
			});
		});

		it('should give me an id for a new instance', function(done) {
			expect(mongooseStarted).to.equal(true);
			var person = new personFactory({name: 'terry'});
			person.save(function(err) {
				var id = person.id;
				expect(!err).to.equal(true);
				console.log('person id=' + id);
				expect(typeof id).to.equal('string');
				done();
			});
		});

		it('should let me drop existing', function(done) {
			expect(mongooseStarted).to.equal(true);
			personFactory.remove({}, function(err) {
				done();
			});
		});

		it('should have zero remaining', function(done) {
			expect(mongooseStarted).to.equal(true);
			personFactory.find({}, function(err, docs) {
				expect(!!err).to.equal(false);
				expect(docs.length).to.equal(0);
				done();
			});
		});

	});
};
