//var Stream = require('stream');
//var _ = require('underscore');

//var Tweets = require('./models/tweet');
//var User = require('./models/user');
//var WSS = require('ws').Server;

module.exports.register = function (plugin, options, next) {
	// TODO: figure out ws requirements. primus?
/*
	var wss = new WSS({ server: plugin.servers[0].listener });
	wss.broadcast = function (data) {
		this.clients.forEach(function (client) {
			client.send(data);
		});
	};

	var routes = [];
	var channelNameForUser = function (userId, channelType, done) {
		User.get(userId, function (err, user) {
			if (err) console.error(err);

			var channel = options.publicUrl + '/wolves/' + user.username + '/' + channelType;
			done(null, channel);
		});
	};

	var sendNotification = function (data) {
		wss.broadcast(JSON.stringify(data));
	};

	var pushHowl = function (model) {
		sendNotification({
			action: 'update',
			channel: options.publicUrl + '/howls',
			url: options.publicUrl + '/howls/' + model.id,
			id: model.id
		});
	};

	var pushUserHowl = function (model) {
		channelNameForUser(model.user, 'howls', function (err, channelName) {
			if (err) return console.log(err);

			sendNotification({
				action: 'update',
				channel: channelName,
				url: options.publicUrl + '/howls/' + model.id,
				id: model.id
			});
		});
	};

	var pushUserMarks = function (model) {
		_.flatten(model.mentions).forEach(function (userId) {
			channelNameForUser(userId, 'marks', function (err, channelName) {
				sendNotification({
					action: 'update',
					channel: channelName,
					url: options.publicUrl + '/howls' + model.id,
					id: model.id
				});
			});
		});
	};

	Tweets.events.on('save', function (model) {
		pushHowl(model);
		pushUserHowl(model);
		pushUserMarks(model);
	});

	next();
*/
};
