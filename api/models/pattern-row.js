var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'pattern-row';
	var schema = mongoose.Schema({
		parent_id: String,
		poolEntry: String,
		steps: [Number]
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);

	return factory;
};
