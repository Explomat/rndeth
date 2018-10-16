const fs = require('fs');

function Logger(options) {
	this.options = options || {};
};

Logger.prototype = (function(){

	let infoStream, errorStream, debugStream;

	function reduceMessage(args){
		args[0] = args[0] + ': ';
		const str = args.reduce((first, second) => {
			return first + second;
		}, '');
		return new Date().toISOString() + '  ' + str + '\n';
	}

	return {
		constructor: Logger,

		createStreams: function(){
			infoStream = fs.createWriteStream((this.options.infoPath || './info.txt'), { flags : 'a' });
			errorStream = fs.createWriteStream((this.options.errorPath || './error.txt'), { flags : 'a' });
			debugStream = fs.createWriteStream((this.options.debugPath || './debug.txt'), { flags : 'a' });
		},
		info: function(){
			const args = Array.prototype.slice.call(arguments);
			const message = reduceMessage(args);
			infoStream.write(message);
		},
		debug: function(){
			const args = Array.prototype.slice.call(arguments);
			const message = reduceMessage(args);
			debugStream.write(message);
		},
		error: function(){
			const args = Array.prototype.slice.call(arguments);
			const message = reduceMessage(args);
			errorStream.write(message);
		}
	}
})();

module.exports = Logger;