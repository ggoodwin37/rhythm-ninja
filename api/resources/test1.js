var Test1Model = require('../models/test1');

module.exports = {
	show: {
		method: 'GET',
		path: '/api/test1',
		handler: function(request, reply) {
			console.log('woohoo we have a test1.show handler firing.');
			// ...
		}
	}

};
