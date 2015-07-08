var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'sample-blob';
	var schema = mongoose.Schema({
		data: Buffer
	});
	require('./schema-id')(schema);

	factory = mongoose.model(modelName, schema);

	return factory;
};
