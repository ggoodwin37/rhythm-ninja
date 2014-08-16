var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'name',
		itemTypeName: 'pattern',
		parentFactory: require('../models/set')(app),
		itemFactory: require('../models/pattern')(app),
		childFactory: require('../models/pattern-row')(app),
		parentCollection: 'patterns',
		childCollection: 'rows',
		routeParentIdKey: 'set_id',
		routeItemIdKey: 'pattern_id',
		updateFields: ['name', 'length', 'locked', 'rows'],
		populateFields: 'rows'
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
