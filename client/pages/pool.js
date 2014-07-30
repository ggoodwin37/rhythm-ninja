var View = require('ampersand-view');
var templates = require('../templates');
var Test1View = require('../views/test1');

module.exports = View.extend({
    template: templates.pages.pool(),
    render: function() {
	this.renderWithTemplate();
	this.renderSubview(new Test1View({
	    model: this.model
	}), '[role=test1]');
    }
});
