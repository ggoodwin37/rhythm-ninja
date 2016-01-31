var Collection = require('ampersand-rest-collection');
var SampleModel = require('./sample');

var SampleCollection = Collection.extend({
	model: SampleModel
});

module.exports = SampleCollection;
