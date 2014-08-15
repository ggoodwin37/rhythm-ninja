var mongoose = require('mongoose');

var modelName = 'pattern-row';
var schema = mongoose.Schema({
	parent_id: String,
	poolEntry: String,
	steps: [Number]
});
require('./schema-id')(schema);
var factory = mongoose.model(modelName, schema);

module.exports = factory;
