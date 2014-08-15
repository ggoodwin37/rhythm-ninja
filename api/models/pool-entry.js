var mongoose = require('mongoose');

var modelName = 'pool-entry';
var schema = mongoose.Schema({
	parent_id: mongoose.Schema.Types.ObjectId,
	name: String,
	volume: Number,
	sampleType: String,
	sampleId: String
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
