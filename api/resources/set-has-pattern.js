var _ = require('underscore');

var opts = {
	parentQueryField: 'name',
	itemTypeName: 'pattern',
	parentFactory: require('../models/set.js'),
	itemFactory: require('../models/pattern.js'),
	childFactory: require('../models/pattern-row.js'),
	parentCollection: 'patterns',
	routeParentIdKey: 'set_id',
	routeItemIdKey: 'pattern_id',
	updateFields: ['name', 'length', 'locked', 'rows']
};
var genericResource = require('./generic-resource')(app, opts);

module.exports = _.extend({
	hasMany: [
		{
			patternrow: require('./pattern-has-rows')(app)
		}
	]
}, genericResource);
