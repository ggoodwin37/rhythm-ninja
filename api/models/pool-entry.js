var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;
	var modelName = 'pool-entry';
	var schema = mongoose.Schema({
		parent_id: String,
		name: String,
		volume: Number,
		sampleType: String,
		sampleId: String
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);
	return factory;
};
