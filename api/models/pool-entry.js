var dulcimer = require('dulcimer');

var PoolEntryFactory = new dulcimer.Model({
	name: {
		type: 'string',
		required: true,
		default: 'default'
	},
	volume: {
		type: 'numeric',
		required: true,
		default: 1.0
	},
	sampleType: {
		type: 'string',
		required: true,
		default: 'local'
	},
	sampleId: {
		type: 'string',
		required: true,
		default: 'default'
	}
}, {
	name: 'pool-entry',
	keyType: 'uuid'
});

module.exports = PoolEntryFactory;
