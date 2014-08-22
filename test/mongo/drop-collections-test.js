db = connect('localhost/rn-test');
var collections = db.getCollectionNames().filter(function(collName) {
	return collName != 'system.indexes';
});

collections.forEach(function(thisColl) {
	db[thisColl].drop();
});
