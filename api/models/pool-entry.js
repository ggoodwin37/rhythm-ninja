var mongoose = require('mongoose');

var modelName = 'pool-entry';
var schema = mongoose.Schema({
	parent_id: String,
	name: String,
	volume: Number,
	sampleType: String,
	sampleId: String
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
