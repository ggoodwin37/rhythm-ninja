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
				var userId = request.params.userSample_id;
				SampleMetaModel.find({ownerUserKey: userId}).exec((err, metaModels) => {
					// TODO: if we don't find anything, should we return an empty array, or 404?
					var resultList = [];
					metaModels.forEach(model => {
						resultList.push(model.toJSON());
					});
					reply({ samples: resultList });
				});
			}
		}
	};
};
