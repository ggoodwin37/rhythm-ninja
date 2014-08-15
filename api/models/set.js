var mongoose = require('mongoose');

var modelName = 'set';
var schema = mongoose.Schema({
	name: String,
	swing: Number,
	bpm: Number,
	pool: [String],
	patterns: [String],
	songs: [String]
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
