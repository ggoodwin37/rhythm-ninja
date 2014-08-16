var inspect = require('eyes').inspector({maxLength: null});
var StepList = require('../../step-list');
var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');

module.exports = function(model, opts, reply, done) {
	var stepList = new StepList();

	// delete all children
	// TODO: this is not recursive so it can't be used for things with more than
	//  one level of children (set)
	if (opts.childFactory) {
		var childIds = model[opts.childCollection];
		childIds.forEach(function(thisChildId) {
			stepList.addStep(function(cb) {
				opts.childFactory.remove({_id: thisChildId}, function(err) {
					if (handlingError(err, reply)) return cb();
					cb();
				});
			});
		});
	}

	// remove from parent collection
	if (opts.parentFactory) {
		stepList.addStep(function(cb) {
			opts.parentFactory.findById(model.parent_id, function(err, parentModel) {
				var newParentCollection = parentModel[opts.parentCollection].filter(function(childId) {
					return childId != model.id;
				});

				var updateData = {};
				updateData[opts.parentCollection] = newParentCollection;

				parentModel.update(updateData, function(err) {
					if (handlingError(err, reply)) return cb();
					cb();
				});
			});
		});
	}

	// delete item itself
	if (opts.itemFactory) {
		stepList.addStep(function(cb) {
			opts.itemFactory.remove({_id: model.id}, function(err) {
				if (handlingError(err, reply)) return cb();
				cb();
			});
		});
	}

	stepList.execute(function() {
		done();
	});
};
