var AmpModel = require('ampersand-model');

module.exports = AmpModel.extend({
    props: {
        _id: ['string'],
        bpm: ['number'],
        name: ['string'],
        patterns: ['array'],
        pool: ['array'],
        songs: ['array'],
        swing: ['number']
    },
	initialize: function(setName) {
		this.setName = setName;
	},
	url: function() {
		return '/api/set/' + this.setName;
	}
});
