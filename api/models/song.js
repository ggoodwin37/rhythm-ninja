var mongoose = require('mongoose');

var modelName = 'song';
var schema = mongoose.Schema({
	parent_id: mongoose.Schema.Types.ObjectId,
	name: String,
	locked: Boolean,
	rows: [mongoose.Schema.Types.ObjectId]
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
