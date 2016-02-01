var mongoose = require('mongoose');
module.exports = function(app) {

	var resources = {
		user: require('./resources/user')(app),
		set: require('./resources/set')(app),
		sample: require('./resources/sample')(app),
		userSamples: require('./resources/user-samples')(app)
	};

	var apiServerPack = {
		register: require('mudskipper'),
		options: {
			namespace: 'api',
			resources: resources
		}
	};

	if (app.config.mongooseDebug) {
		mongoose.set('debug', true);
	}

	var dbName = app.config.dbName;
	// TODO: don't hardcode hostname here
	mongoose.connect('mongodb://localhost/' + dbName);
	app.mongooseStarted = false;

	var db = mongoose.connection;
	db.on('error', function(err) {
		console.log('connection error: ' + err);
	});
	db.once('open', function callback () {
		app.mongooseStarted = true;
		console.log('connected to db named: ' + dbName);
	});

	return apiServerPack;
};
