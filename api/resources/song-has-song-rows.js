var _ = require('underscore');

module.exports = function(app) {

	var opts = {
		parentQueryField: 'id',
		itemTypeName: 'song-row',
		parentFactory: require('../models/song'),
		itemFactory: require('../models/song-row'),
		childFactory: null,
		parentCollection: 'rows',
		routeParentIdKey: 'song_id',
		routeItemIdKey: 'songrow_id',
		updateFields: ['patternId', 'offset', 'len', 'count']
	};
	var genericResource = require('./generic-resource')(app, opts);
	return genericResource;
};
