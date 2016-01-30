var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	var verifyAuth = require('./verify-auth')(app);
	var handlingError = require('../handling-error');
	var handlingErrorOrMissing = require('../handling-error-or-missing');
	var SampleMetaModel = require('../models/sample-meta.js')(app);

	return {
		show: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;
				inspect(request.params); // TODO:what's the param name here?
				return reply();

				// var sampleMetaId = request.params.sample_id;  // lol magic
				// SampleMetaModel.findById(sampleMetaId).exec((err, metaModel) => {
				// 	if (handlingErrorOrMissing(err, metaModel, reply)) return;
				// 	var sampleBlobId = metaModel.blobId;
				// 	SampleBlobModel.findById(sampleBlobId).exec((err, blobModel) => {
				// 		if (handlingErrorOrMissing(err, blobModel, reply)) return;
				// 		var response = reply(blobModel.data);
				// 		response.type(metaModel.contentType);
				// 		return;
				// 	});
				// });
			}
		}
	};
};
