var mongoose = require('mongoose');

var modelName = 'pattern';
var schema = mongoose.Schema({
	parent_id: mongoose.Schema.Types.ObjectId,
	name: String,
	length: {type: Number, default: 16},
	locked: Boolean,
	rows: [mongoose.Schema.Types.ObjectId]
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
