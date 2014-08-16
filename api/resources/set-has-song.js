var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'name',
		itemTypeName: 'song',
		parentFactory: require('../models/set')(app),
		itemFactory: require('../models/song')(app),
		childFactory: require('../models/song-row')(app),
		parentCollection: 'songs',
		routeParentIdKey: 'set_id',
		routeItemIdKey: 'song_id',
		updateFields: ['name', 'locked', 'rows']
	};
	var genericResource = require('./generic-resource')(app, opts);

	return _.extend({
		hasMany: [
			{
				songrow: require('./song-has-song-rows')(app)
			}
		]
	}, genericResource);
};
