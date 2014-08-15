var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'id',
		itemTypeName: 'pattern-row',
		parentFactory: require('../models/pattern'),
		itemFactory: require('../models/pattern-row'),
		childFactory: null,
		parentCollection: 'rows',
		routeParentIdKey: 'pattern_id',
		routeItemIdKey: 'patternrow_id',
		updateFields: ['poolEntry', 'steps']
	};
	var genericResource = require('./generic-resource')(app, opts);
	return genericResource;
};
