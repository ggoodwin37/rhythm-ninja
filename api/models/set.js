var mongoose = require('mongoose');

var modelName = 'set';
var schema = mongoose.Schema({
	name: String,
	swing: Number,
	bpm: Number,
	pool: [mongoose.Schema.Types.ObjectId],
	patterns: [mongoose.Schema.Types.ObjectId],
	songs: [mongoose.Schema.Types.ObjectId]
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
