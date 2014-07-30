var View = require('ampersand-view');
var templates = require('../templates');
var Test1View = require('../views/test1');

module.exports = View.extend({
    template: templates.pages.pool(),
    subviews: {
	test1: {
	    constructor: Test1View,
	    role: 'test1'
	}
    }
});
