function handlingError(err, reply) {
	if (err) {
		if (err.type == 'NotFoundError') {
			reply().code(404);
			return true;
		}
		reply(new Error(err));
		return true;
	}
	return false;
}

module.exports = handlingError;
