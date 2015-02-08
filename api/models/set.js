var mongoose = require('mongoose');
var deepPopulate = require('mongoose-deep-populate');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'set';
	var schema = mongoose.Schema({
		name: String,
		swing: Number,
		bpm: Number,
		pool: [{type: String, ref: 'pool-entry'}],
		patterns: [{type: String, ref: 'pattern'}],
		songs: [{type: String, ref: 'song'}]
	});
	require('./schema-id')(schema);

	var deepPopulateOptions = {
	};
	schema.plugin(deepPopulate, deepPopulateOptions);
	factory = mongoose.model(modelName, schema);

	return factory;
};
