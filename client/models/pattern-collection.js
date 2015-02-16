var Collection = require('ampersand-rest-collection');
var PatternModel = require('./pattern');

var PatternCollection = Collection.extend({
	model: PatternModel
});

module.exports = PatternCollection;
