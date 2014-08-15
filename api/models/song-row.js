var mongoose = require('mongoose');

var modelName = 'song-row';
var schema = mongoose.Schema({
	parent_id: String,
	pattern_id: String,
	offset: Number,
	len: Number,
	count: Number
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
