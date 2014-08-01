module.exports = function() {
	var resources = {
		test1: require('./resources/test1')
	};

	// TODO gideong: where do we consume this? might have to move
	var dulcimer = require('dulcimer');
	dulcimer.connect({
		type: 'level',
		path: __dirname + '/db',
		bucket: 'rhythm-ninja'
	});

	//var Test1Model = require('./models/test1');

	var apiServerPack = {
		plugin: require('mudskipper'),
		options: {
			namespace: 'api',
			resources: resources
		}
	};
	return apiServerPack;
};
