var verymodel = require('verymodel');

var PoolEntryFactory = new verymodel.Model({
	id: {
		derive: function() {
			return this.key;
		}
	},
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
