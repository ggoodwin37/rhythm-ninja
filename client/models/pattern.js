var AmpModel = require('ampersand-model');

module.exports = AmpModel.extend({
    props: {
        _id: ['string'],
        length: ['number'],
        locked: ['boolean'],
        name: ['string'],
        parent_id: ['string'],
        rows: ['array']
    },
	initialize: function(params) {
		this.setName = params.setName;
		this.id = params.patternId;
	},
	url: function() {
		return '/api/set/' + this.setName + '/pattern/' + this.id;
	}
});
