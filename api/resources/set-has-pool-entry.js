var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'name',
		itemTypeName: 'pool',
		parentFactory: require('../models/set')(app),
		itemFactory: require('../models/pool-entry')(app),
		childFactory: null,
		parentCollection: 'pool',
		routeParentIdKey: 'set_id',
		routeItemIdKey: 'poolentry_id',
		updateFields: ['name', 'volume', 'sampleType', 'sampleId']
	};
	var genericResource = require('./generic-resource')(app, opts);

	return genericResource;
};
