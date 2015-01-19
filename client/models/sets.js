var AmpCollection = require('ampersand-rest-collection');
var Set = require('./set');

module.exports = AmpCollection.extend({
    model: Set,
    url: '/api/set'
});
