var dulcimer = require('dulcimer');

var PoolEntryFactory = new dulcimer.Model({
	name: {
		type: 'string'
	},
	volume: {
		type: 'numeric'
	},
	sampleType: {
		type: 'string'
	},
	sampleId: {
		type: 'string'
	}
}, {
	name: 'pool-entry',
	keyType: 'uuid'
});

module.exports = PoolEntryFactory;
