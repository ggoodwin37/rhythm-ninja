var dulcimer = require('dulcimer');

var Test1Factory = new dulcimer.Model({
	testFlag: {
		type: 'boolean',
		required: true,
		default: true
	},
	id: {
		derive: function() {
			return this.key;
		}
	},
	testField: {
	}
}, {
	name: 'test1',
	keyType: 'uuid'
});

module.exports = Test1Factory;
