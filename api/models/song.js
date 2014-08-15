var mongoose = require('mongoose');

var modelName = 'song';
var schema = mongoose.Schema({
	parent_id: String,
	name: String,
	locked: Boolean,
	rows: [String]
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
