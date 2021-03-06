const fs = require('fs');

function Logger(options) {
	this.options = options || {};
};

Logger.prototype = (function(){

	let infoStream, errorStream, debugStream;

	function concatDate(msg){
		return new Date().toISOString() + '  ' + msg + '\n';
	}

	function reduceMessage(args){
		args[0] = args[0] + ': ';
		const str = args.reduce((first, second) => {
			return first + second;
		}, '');
		return concatDate(str);
	}

	function getMessage(args){
		if (args.length === 0) return '';

		if (args.length === 1){
			return concatDate(args[0]);
		}

		return reduceMessage(args);
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
			const message = getMessage(args);

			if (message === '') return;
			infoStream.write(message);
		},
		debug: function(){
			const args = Array.prototype.slice.call(arguments);
			const message = getMessage(args);

			if (message === '') return;
			debugStream.write(message);
		},
		error: function(){
			const args = Array.prototype.slice.call(arguments);
			const message = getMessage(args);

			if (message === '') return;
			errorStream.write(message);
		}
	}
})();

module.exports = Logger;