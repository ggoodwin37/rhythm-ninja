var Test1Model = require('../models/test1');

module.exports = {
	show: {
		method: 'GET',
		path: '/api/test1',
		handler: function(request, reply) {
			var id = 'api-response_' + request.params.test1_id;
			var name = 'name-from-api';
			reply({
				id: id,
				name: name
			});
		}
	}

};
