var async = require('async');

function StepList() {
	this.taskList = [];
}

StepList.prototype.addStep = function(step) {
	this.taskList.push(step);
}

StepList.prototype.execute = function(done) {
	async.series(this.taskList, done);
}

module.exports = StepList;
