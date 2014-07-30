var hapi = require('hapi');
var config = require('getconfig');

var server = new hapi.Server(config.serverPort, config.serverHost, {
    // not using any server views right now.
    // views: {
    //     engines: { jade: require('jade') },
    //     path: __dirname + '/templates'
    // },

    // haven't tested cors yet, can
    // cors: {
    //     origin: ['*'],
    //     headers: ['Authorization', 'Content-Type', 'If-None-Match', 'Auth-Token']
    // }
});

var resources = {
    // TODO: resources here.
    // wolves: require('./resources/users'),
    // howls: require('./resources/tweets')
};

var dulcimer = require('dulcimer');
dulcimer.connect({
    type: 'level',
    path: __dirname + '/db',
    bucket: 'TODO' // TODO
});

// TODO: models
// var Tweet = require('./models/tweet');
// var User = require('./models/user');

server.pack.register(require('lout'), function () {});

server.pack.register([
    {
        plugin: require('mudskipper'),
        options: { resources: resources }
    },
    // {
    //     plugin: require('./notify'),
    //     options: { publicUrl: 'http://' + config.serverHost + ':' + config.serverPort }
    // },
    {
	plugin: require('moonboots_hapi'),
	options: {
	    appPath: '/{p*}',
	    moonboots: {
		main: __dirname + '/client/app.js',
		developmentMode: config.isDev,
		stylesheets: [
		    __dirname + '/dist/css/main.css'
		],
		beforeBuildJS: function() {
		    if (config.isDev) {
			var templatizer = require('templatizer');
			templatizer(__dirname + '/templates', __dirname + '/client/templates.js');
		    }

		}
	    }
	}
    }
], function (err) {
    if (err) throw err;

    // TODO: what server routes do we need here? api/mudskipper?
    // server.route(require('./resources/client')());
    // server.route({
    //     method: 'GET',
    //     path: '/public/{param*}',
    //     handler: {
    //         directory: {
    //             path: 'public'
    //         }
    //     }
    // });

    server.start(function () {
        console.log('rhythm-ninja is running at', server.info.uri);
    });
});
