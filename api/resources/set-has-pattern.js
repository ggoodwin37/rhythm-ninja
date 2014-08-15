var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'name',
		itemTypeName: 'pattern',
		parentFactory: require('../models/set'),
		itemFactory: require('../models/pattern'),
		childFactory: require('../models/pattern-row'),
		parentCollection: 'patterns',
		routeParentIdKey: 'set_id',
		routeItemIdKey: 'pattern_id',
		updateFields: ['name', 'length', 'locked', 'rows']
	};
	var genericResource = require('./generic-resource')(app, opts);

	return _.extend({
		hasMany: [
			{
				patternrow: require('./pattern-has-rows')(app)
			}
		]
	}, genericResource);
};
