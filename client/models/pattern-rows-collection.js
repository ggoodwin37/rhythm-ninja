var Collection = require('ampersand-rest-collection');
var PatternRowModel = require('./pattern-row');

var PatternRowsCollection = Collection.extend({
	model: PatternRowModel
});

module.exports = PatternRowsCollection;
