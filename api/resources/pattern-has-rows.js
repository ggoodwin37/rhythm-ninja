var SetFactory = require('../models/set');
var PatternFactory = require('../models/pattern');
var PatternRowFactory = require('../models/pattern-row');
var handlingError = require('../handling-error');
var inspect = require('eyes').inspector({hideFunctions: true, maxLength: null});
var async = require('async');

module.exports = {
	show: function(request, reply) {
		var patternId = request.params.pattern_id;
		var rowId = request.params.row_id;
		// TODO: validate set/authenticate
		PatternRowFactory.get(rowId, function(err, rowModel) {
			if (handlingError(err, reply)) return;
			return reply(rowModel);
		});
	},
	create: function(request, reply) {
		var patternId = request.params.pattern_id;
		var rowData = request.payload;
		var rowModel = PatternRowFactory.create(rowData);
		rowModel.save(function(err) {
			if (handlingError(err, reply)) return;
			PatternFactory.get(patternId, function(err, patternModel) {
				if (handlingError(err, reply)) return;
				var newRows = patternModel.rows.slice(0);
				newRows.push(rowModel);

				PatternFactory.update(patternModel.key, {rows: newRows}, function(err, newModel) {
					if (handlingError(err, reply)) return;
					console.log('created a new patternRow: ' + rowModel.key);
					reply(rowModel);
				});
			});
		});
	},
	update: function(request, reply) {
		var patternId = request.params.pattern_id;
		var rowId = request.params.row_id;
		var updatedRowData = request.payload;
		PatternRowFactory.get(rowId, function(err, rowModel) {
			if (handlingError(err, reply)) return;
			// TODO: consider using extend pattern here instead
			var mergeObject = {};
			if (updatedRowData.poolEntry) {
				mergeObject['poolEntry'] = updatedRowData.poolEntry;
			}
			if (updatedRowData.steps) {
				mergeObject['steps'] = updatedRowData.steps;
			}
			PatternRowFactory.update(rowModel.key, mergeObject, function(err, updatedModel) {
				if (handlingError(err, reply)) return;
				reply(updatedModel);
			});
		});
	},
	destroy: function(request, reply) {
		var patternId = request.params.pattern_id;
		var rowId = request.params.row_id;

		async.series([
			function(callback) {
				// first check the pattern for any instances of this rowId
				PatternFactory.get(patternId, function(err, patternModel) {
					if (handlingError(err, reply)) return callback();

					var newRows = patternModel.rows.slice(0).filter(function(thisRowEl) {
						return thisRowEl.key !== rowId;
					});

					PatternFactory.update(patternModel.key, {rows: newRows}, function(err, newModel) {
						if (handlingError(err, reply)) return callback();
						callback();
					});
				});
			},
			function(callback) {
				// TODO: validate set/authenticate
				PatternRowFactory.get(rowId, function(err, rowModel) {
					if (handlingError(err, reply)) return callback();
					rowModel.delete(function(err) {
						if (handlingError(err, reply)) return;
						callback();
					});
				});
			}
		], function() {
			reply();
		});
	}
};
