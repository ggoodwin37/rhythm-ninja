var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: '_id',
		itemTypeName: 'pattern-row',
		parentFactory: require('../models/pattern')(app),
		itemFactory: require('../models/pattern-row')(app),
		childFactory: null,
		parentCollection: 'rows',
		routeParentIdKey: 'pattern_id',
		routeItemIdKey: 'patternrow_id',
		updateFields: ['poolEntry', 'steps']
	};
	var genericResource = require('./generic-resource')(app, opts);
	return genericResource;
};
