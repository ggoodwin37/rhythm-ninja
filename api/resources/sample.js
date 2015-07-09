var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	var verifyAuth = require('./verify-auth')(app);
	var handlingError = require('../handling-error');
	var SampleMetaModel = require('../models/sample-meta.js')(app);
	var SampleBlobModel = require('../models/sample-blob.js')(app);

	return {
		show: {
			handler: function(request, reply) {
				// TODO: lookup blob by meta id.
				console.log('sample show');
				inspect(Object.keys(request));
				reply();
			}
		},
		create: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				// first store the blob
				// TODO: handle max buffer size, avoid copy, generally make this better
				var data = new Buffer(request.payload);
				var sampleBlob = new SampleBlobModel({
					data: data
				});
				sampleBlob.save(function(err, savedBlob) {
					if (handlingError(err, reply)) return reply();

					// blob is stored, write the metadata
					var sampleMeta = new SampleMetaModel({
						name: 'TODO-fix-sample-meta-name',  // TODO: err, query param?
						blobId: savedBlob.id,
						ownerUserKey: (request.auth && request.auth.credentials) ? request.auth.credentials.rnUserKey : null,
						isPublic: true
					});
					sampleMeta.save(function(err, savedMeta) {
						if (handlingError(err, reply)) return reply();
						var result = savedMeta.toJSON();
						delete result.blobId;  // don't expose blobId to client, they don't need it.
						reply(result);
					});
				});
			},
			config: {
				payload: {
					parse: false,
					allow: require('./sample-mime-types')
				}
			}
		},
		destroy: {
			handler: function(request, reply) {
				console.log('sample delete');
				inspect(Object.keys(request));
				reply();
			}
		}
	};
};
