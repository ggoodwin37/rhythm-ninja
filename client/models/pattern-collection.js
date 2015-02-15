var Collection = require('ampersand-collection');
var PatternModel = require('./pattern');

var PatternCollection = Collection.extend({
	model: PatternModel
});

module.exports = PatternCollection;
