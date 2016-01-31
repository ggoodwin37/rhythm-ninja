var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});

function getUserIdFromRequest(request) {
	// check for special header indicating this is running from a test.
	// this is only used to avoid the need to have the test be auth'd
	// if set, build an id out of this value, letting us have a few different
	// test ids to faciliate cross-user test scenarios.
	const underTest = request.headers['x-under-test'];
	var sampleOwner;
	if (!!underTest && underTest.length < 2) {  // :shrug:
		const testUserIdBase = 'test_user_id_';
		sampleOwner = testUserIdBase + underTest;
	} else {
		sampleOwner = (request.auth && request.auth.credentials) ? request.auth.credentials.rnUserKey : null;
	}
	return sampleOwner;
}

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

				var sampleMetaId = request.params.sample_id;  // lol magic
				SampleMetaModel.findById(sampleMetaId).exec((err, metaModel) => {
					if (handlingErrorOrMissing(err, metaModel, reply)) return;
					var sampleBlobId = metaModel.blobId;
					SampleBlobModel.findById(sampleBlobId).exec((err, blobModel) => {
						if (handlingErrorOrMissing(err, blobModel, reply)) return;
						var response = reply(blobModel.data);
						response.type(metaModel.contentType);
						return;
					});
				});
			}
		},
		create: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				// first store the blob
				// TODO: handle max buffer size
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
					// TODO: probably shouldn't just trust request mimeType here.
					var contentType = request.mime;
					var sampleName = request.headers['x-sample-name'] || 'Unnamed';

					var userId = getUserIdFromRequest(request);
					var sampleMeta = new SampleMetaModel({
						name: sampleName,
						blobId: savedBlob.id,
						contentType: contentType,
						ownerUserKey: userId,
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
					output: 'data',  // TODO: consider stream instead
					allow: require('./sample-mime-types')
				}
			}
		},
		destroy: {
			handler: function(request, reply) {
				if (!verifyAuth(request, reply)) return;

				const userId = getUserIdFromRequest(request);
				var sampleMetaId = request.params.sample_id;
				SampleMetaModel.findById(sampleMetaId).exec((err, metaModel) => {
					if (handlingErrorOrMissing(err, metaModel, reply)) return;
					if (metaModel.ownerUserKey !== userId) {
						return reply().code(401);
					}
					var sampleBlobId = metaModel.blobId;
					SampleBlobModel.remove({_id: sampleBlobId}, (err) => {
						if (handlingError(err, reply)) return;
						SampleMetaModel.remove({_id: sampleMetaId}, (err) => {
							if (handlingError(err, reply)) return;
							return reply();
						});
					});
				});
			}
		}
	};
};
