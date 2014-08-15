var mongoose = require('mongoose');

var modelName = 'pool-entry';
var schema = mongoose.Schema({
	name: String,
	volume: Number,
	sampleType: String,
	sampleId: String
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
