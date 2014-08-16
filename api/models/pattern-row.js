var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;

	var modelName = 'pattern-row';
	var schema = mongoose.Schema({
		parent_id: String,
		poolEntry: String,
		steps: [Number]
	});
	factory = mongoose.model(modelName, schema);

	var tdOpts = {
		parentFactory: require('./pattern')(app),
		parentCollection: 'rows'
	};
	require('./tree-delete')(schema, tdOpts);
	require('./schema-id')(schema);

	return factory;
};
