var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;
	var modelName = 'set';
	var schema = mongoose.Schema({
		name: String,
		swing: Number,
		bpm: Number,
		pool: [String],
		patterns: [String],
		songs: [String]
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);
	return factory;
};
