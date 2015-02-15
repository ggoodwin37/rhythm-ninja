var AmpModel = require('ampersand-model');

var PatternRowModel = AmpModel.extend({
    props: {
		id: 'string',
		poolEntry: 'string',
		steps: 'array'
	},
	initialize: function(model) {
		this.setName = 'TODO';
		this.patternName = 'WTF';
	},
	urlRoot: function() {
		var urlRoot = '/api/set/' + this.setName + '/pattern/' + this.patternName;
		console.log('pattern-row: urlRoot is: ' + urlRoot);
		return urlRoot;
	}
});

module.exports = PatternRowModel;
