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
	factory = mongoose.model(modelName, schema);

	var tdOpts = {
		parentFactory: require('./set')(app),
		parentCollection: 'pool'
	};
	require('./tree-delete')(schema, tdOpts);
	require('./schema-id')(schema);

	return factory;
};
