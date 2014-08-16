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
	require('./schema-id')(schema);

	var tdOpts = {
		parentFactory: require('./pattern')(app),
		parentCollection: 'rows'
	};
	require('./tree-delete')(schema, tdOpts);

	factory = mongoose.model(modelName, schema);
	return factory;
};
