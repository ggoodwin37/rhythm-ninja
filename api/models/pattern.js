var mongoose = require('mongoose');

var modelName = 'pattern';
var schema = mongoose.Schema({
	parent_id: String,
	name: String,
	length: {type: Number, default: 16},
	locked: Boolean,
	rows: [String],
});
require('./schema-id')(schema);

// TODO gideong: looks like we don't need app in these models any more, clean up (../api.js for one)

// TODO gideong: can remove some options from the resources side if they're only consumed here.
var tdOpts = {
	parentFactory: require('./set'),
	childFactory: require('./pattern-row'),
	parentCollection: 'patterns',
	childCollection: 'rows'
};
require('./tree-delete')(schema, tdOpts);

var factory = mongoose.model(modelName, schema);

module.exports = factory;
