var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'song-row';
	var schema = mongoose.Schema({
		parent_id: String,
		pattern_id: String,
		offset: Number,
		len: Number,
		count: Number
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);

	return factory;
};
