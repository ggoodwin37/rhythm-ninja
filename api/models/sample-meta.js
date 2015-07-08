var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'sample-meta';
	var schema = mongoose.Schema({
		name: String,
		blobId: String,   // TODO: consider mongoose.Types.ObjectId?
		ownerUserKey: String,
		isPublic: Boolean
		// TODO: create date, bpm, tags, etc.
	});
	require('./schema-id')(schema);

	factory = mongoose.model(modelName, schema);

	return factory;
};
