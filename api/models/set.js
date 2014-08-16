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

	// TODO gideong: fix this so that tree-delete can work with set.
	// var tdOpts = {
	// 	childFactory: require('./pattern-row')(app),
	// 	childCollections: 'rows'
	// };
	// require('./tree-delete')(schema, tdOpts);

	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);
	return factory;
};
