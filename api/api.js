module.exports = function(app) {
	var resources = {
		set: require('./resources/set')(app),
		sample: require('./resources/sample')(app)
	};

	var apiServerPack = {
		plugin: require('mudskipper'),
		options: {
			namespace: 'api',
			resources: resources
		}
	};
	return apiServerPack;
};
