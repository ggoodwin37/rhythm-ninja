// this is used in findByIndex where we could have no error but also no result
function handlingErrorOrMissing(err, result, reply) {
	if (err) {
		if (err.type == 'NotFoundError') {
			reply().code(404);
			return true;
		}
		reply(new Error(err));
		return true;
	}
	if (!result) {
		reply().code(404);
		return true;
	}
	return false;
}

module.exports = handlingErrorOrMissing;
