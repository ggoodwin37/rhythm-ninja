var mongoose = require('mongoose');

var modelName = 'pattern';
var schema = mongoose.Schema({
	parent_id: mongoose.Schema.Types.ObjectId,
	name: String,
	length: {type: Number, default: 16},
	locked: Boolean,
	rows: [mongoose.Schema.Types.ObjectId]
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
