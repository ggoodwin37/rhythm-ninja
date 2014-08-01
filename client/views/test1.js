var View = require('ampersand-view');
var templates = require('../templates');

module.exports = View.extend({
	template: templates.includes.test1,
	bindings: {
		'model.id': '[role=id]',
		'model.name': '[role=name]'
	}
});
