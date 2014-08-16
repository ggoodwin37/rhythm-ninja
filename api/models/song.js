var mongoose = require('mongoose');

var factory = null;
module.exports = function(app) {

	if (factory) return factory;
	var modelName = 'song';
	var schema = mongoose.Schema({
		parent_id: String,
		name: String,
		locked: Boolean,
		rows: [String]
	});

	var tdOpts = {
		parentFactory: require('./set')(app),
		childFactory: require('./song-row')(app),
		parentCollection: 'songs',
		childCollection: 'rows'
	};
	require('./tree-delete')(schema, tdOpts);

	require('./schema-id')(schema);
	factory = mongoose.model(modelName, schema);
	return factory;
};
