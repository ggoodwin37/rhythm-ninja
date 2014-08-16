var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;
	var modelName = 'pattern';
	var schema = mongoose.Schema({
		parent_id: String,
		name: String,
		length: {type: Number, default: 16},
		locked: Boolean,
		rows: [String],
	});
	require('./schema-id')(schema);

	factory = mongoose.model(modelName, schema);

	// TODO gideong: can remove some options from the resources side if they're only consumed here.
	var tdOpts = {
		parentFactory: require('./set')(app),
		childFactory: require('./pattern-row')(app),
		parentCollection: 'patterns',
		childCollection: 'rows'
	};
	require('./tree-delete')(schema, tdOpts);

	return factory;
};
