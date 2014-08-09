var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var handlingError = require('../handling-error');
var SetInfoFactory = require('../models/set-info');

module.exports = function(app) {
	return {
		index: function(request, reply) {
			SetInfoFactory.all(function(err, models, pagination) {
				if (handlingError(err, reply)) return;
				reply(models.map(function(model) { return model.toJSON(); }));
			});
		},
		show: function(request, reply) {
			var setInfoId = request.params.setInfo_id;
			SetInfoFactory.get(setInfoId, function(err, setInfoModel) {
				if (handlingError(err, reply)) return;
				reply(setInfoModel.toJSON());
			});
		},
		create: function(request, reply) {
			var setInfoModel = SetInfoFactory.create(request.payload);
			setInfoModel.save(function(err) {
				if (handlingError(err, reply)) return;
				reply(setInfoModel.toJSON());
			});
		},
		update: function(request, reply) {
			var setInfoId = request.params.setInfo_id;
			var updatedData = request.payload;

			SetInfoFactory.get(setInfoId, function(err, setInfoModel) {
				if (handlingError(err, reply)) return;

				var mergeObject = {};
				if (typeof updatedData.swing != 'undefined') {
					mergeObject.swing = updatedData.swing;
				}
				if (typeof updatedData.bpm != 'undefined') {
					mergeObject.bpm = updatedData.bpm;
				}

				SetInfoFactory.update(setInfoModel.key, mergeObject, function(updateErr, updateResult) {
					if (updateErr) return reply(new Error(updateErr));
					return reply(updateResult.toJSON());
				});
			});
		},
		destroy: function(request, reply) {
			var setInfoId = request.params.setInfo_id;
			SetInfoFactory.get(setInfoId, function(err, setInfoModel) {
				if (handlingError(err, reply)) return;
				setInfoModel.delete(function(err) {
					if (handlingError(err, reply)) return;
					reply();
				});
			});
		}
	}
};
