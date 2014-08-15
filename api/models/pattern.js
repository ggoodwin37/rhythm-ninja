var mongoose = require('mongoose');

var modelName = 'pattern';
var schema = mongoose.Schema({
	parent_id: String,
	name: String,
	length: {type: Number, default: 16},
	locked: Boolean,
	rows: [String],
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
