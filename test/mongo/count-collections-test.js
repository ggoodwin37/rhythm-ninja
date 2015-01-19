db = connect('localhost/rn-test');
var collections = db.getCollectionNames().filter(function(collName) {
	return collName != 'system.indexes';
});

print('-----------');
collections.forEach(function(thisColl) {
	print('' + thisColl + ': ' + db[thisColl].count());
});
