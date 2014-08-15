var mongoose = require('mongoose');

var modelName = 'song';
var schema = mongoose.Schema({
	name: String,
	locked: Boolean,
	rows: [mongoose.Schema.Types.ObjectId]
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
