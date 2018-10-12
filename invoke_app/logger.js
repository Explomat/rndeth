const fs = require('fs');

function Logger(options) {
	const _options = options || {};
	this.infoStream = fs.createWriteStream((_options.infoPath || './info.txt'), { flags : 'a' });
	this.errorStream = fs.createWriteStream((_options.errorPath || './error.txt'), { flags : 'a' });
	this.debugStream = fs.createWriteStream((_options.debugPath || './debug.txt'), { flags : 'a' });
};

Logger.prototype.info = function(msg) {
	const message = new Date().toISOString() + " : " + msg + "\n";
	this.infoStream.write(message);
};

Logger.prototype.debug = function(msg) {
	const message = new Date().toISOString() + " : " + msg + "\n";
	this.debugStream.write(message);
};

Logger.prototype.error = function(msg) {
	const message = new Date().toISOString() + " : " + msg + "\n";
	this.errorStream.write(message);
};

module.exports = Logger;