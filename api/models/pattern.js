var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'pattern';
	var schema = mongoose.Schema({
		parent_id: String,
		name: String,
		length: {type: Number, default: 16},
		locked: Boolean,
		rows: [{type: String, ref: 'pattern-row'}]
	});
	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);

	return factory;
};
