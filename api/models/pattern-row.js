var mongoose = require('mongoose');

var modelName = 'pattern-row';
var schema = mongoose.Schema({
	poolEntry: String,
	steps: [Number]
});
var factory = mongoose.model(modelName, schema);

module.exports = factory;
