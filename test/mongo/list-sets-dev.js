db = connect('localhost/rn-dev');
print('-----------');
db['sets'].find().forEach(function(data) {
	print('' + data.name);
});
