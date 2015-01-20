var AmpCollection = require('ampersand-rest-collection');
var Pattern = require('./pattern');

module.exports = AmpCollection.extend({
    model: Pattern,
	initialize: function(params) {
		console.log('init patterns collection with params:', params);
		this.setName = (params || {}).setName;
	},
	url: function() {
		// TODO: I think this endpoint doesn't exist, although it's in the doc.
		return '/api/set/' + this.setName + '/pattern/';
	}
});
