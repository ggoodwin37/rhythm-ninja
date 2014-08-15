var mongoose = require('mongoose');
module.exports = function(app) {

	var resources = {
		// set: require('./resources/set')(app),
		// sample: require('./resources/sample')(app)
	};

	var apiServerPack = {
		plugin: require('mudskipper'),
		options: {
			namespace: 'api',
			resources: resources
		}
	};

	// TODO: figure out what config you need for this
	mongoose.connect('mongodb://localhost/rn-test');
	app.mongooseStarted = false;

	var db = mongoose.connection;
	db.on('error', function(err) {
		console.log('connection error: ' + err);
	});
	db.once('open', function callback () {
		app.mongooseStarted = true;
		console.log('mongoose started');
	});

	return apiServerPack;
};
