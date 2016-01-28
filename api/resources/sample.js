var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

module.exports = function(app) {
	var verifyAuth = require('./verify-auth')(app);
	var handlingError = require('../handling-error');
	var handlingErrorOrMissing = require('../handling-error-or-missing');
	var SampleMetaModel = require('../models/sample-meta.js')(app);
	var SampleBlobModel = require('../models/sample-blob.js')(app);

	return {
		show: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				// TODO: lookup blob by meta id.
				var sampleMetaId = request.params.sample_id;  // lol magic
				SampleMetaModel.findById(sampleMetaId).exec((err, setModel) => {
					if (handlingErrorOrMissing(err, setModel, reply)) return;
					return reply(setModel.toJSON());  // TODO: blob payload instead
				});
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
					if (handlingError(err, reply)) {
						// saw an error here due to some bit rot in mongoose/mongo. This was 500'ing with an empty error.
						// after I nuked node_modules and reinstalled, it went away :shrug:
						return;
					}

					// blob is stored, write the metadata
					var sampleMeta = new SampleMetaModel({
						name: 'TODO-fix-sample-meta-name',  // TODO: err, query param?
						blobId: savedBlob.id,
						ownerUserKey: (request.auth && request.auth.credentials) ? request.auth.credentials.rnUserKey : null,
						isPublic: true
					});
					sampleMeta.save(function(err, savedMeta) {
						if (handlingError(err, reply)) return;
						var result = savedMeta.toJSON();
						delete result.blobId;  // don't expose blobId to client, they don't need it.
						//console.log('created new sample with sampleMetaId: ' + savedMeta.id + ' and blobId: ' + savedBlob.id);
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
				if (!verifyAuth(request, reply)) return;

				console.log('sample delete for id: ' + request.params.sample_id);
				reply();
			}
		}
	};
};
