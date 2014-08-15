var mongoose = require('mongoose');

var modelName = 'pattern-row';
var schema = mongoose.Schema({
	parent_id: mongoose.Schema.Types.ObjectId,
	poolEntry: String,
	steps: [Number]
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
