db = connect('localhost/rn-test');
print('-----------');
db['sets'].find().forEach(function(data) {
	print('' + data.name);
});
