var inspect = require('eyes').inspector({maxLength: null});
var StepList = require('../../step-list');
var handlingError = require('../handling-error');
var handlingErrorOrMissing = require('../handling-error-or-missing');
var _ = require('underscore');

module.exports = function(opts, itemId, itemData, done) {
	var stepList = new StepList();

	// update the item itself
	stepList.addStep(function(cb) {
		var conditions = {
			_id: itemId
		};
		var options = {};

		// mongoose tries to do a shallow update in findOneAndUpdate, but was casting some values
		// incorrectly. get around this by doing an explicit shallow copy.
		var shallowItemData = createShallowItem(itemData);
		opts.itemFactory.findOneAndUpdate(conditions, shallowItemData, options, function(err, numChanged) {
			if (handlingError(err, done)) return cb();
			cb();
		});
	});

	// TODO: this is not recursive so it can't be used for things with more than
	//  one level of children, set in particular. Also, this assumes there's only
	//  one child collection, which happens to be true for everything other than set.
	if (opts.childCollection) {
		var collection = itemData[opts.childCollection] || [];
		collection.forEach(function(childItemData) {
			if (typeof childItemData !== 'object') return;  // might be doing an order-only shallow update.
			stepList.addStep(function(cb) {
				var conditions = {
					_id: childItemData.id || null
				};
				var options = {};
				opts.childFactory.findOneAndUpdate(conditions, childItemData, options, function(err, numChanged) {
					if (handlingError(err, done)) return cb();
					cb();
				});
			});
		});
	}

	stepList.execute(function() {
		done();
	});

	function createShallowItem(originalItem) {
		var result = _.clone(originalItem);  // shallow clone
		if (opts.childCollection && result[opts.childCollection]) {
			result[opts.childCollection] = result[opts.childCollection].map(function(item) {
				if (typeof item === 'string') return item;
				else return item.id;
			});
		}
		return result;
	}
};
