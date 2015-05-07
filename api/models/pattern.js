var mongoose = require('mongoose');
var PatternRow = require('./pattern-row');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'pattern';
	var schema = mongoose.Schema({
		parent_id: String,
		name: String,
		length: {type: Number, default: 16},
		locked: Boolean,
		rows: [PatternRow]  // breaks lots of tests. does this explain the [Object object] cast in generic save?
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);

	return factory;
};
