var AmpModel = require('ampersand-model');

module.exports = AmpModel.extend({
    props: {
        id: ['string'],
        bpm: ['number'],
        name: ['string'],
        patterns: ['array'],
        pool: ['array'],
        songs: ['array'],
        swing: ['number']
    },
	initialize: function(params) {
		this.id = (params || {}).setName;
	},
	url: function() {
		return '/api/set/' + this.id;
	}
});
