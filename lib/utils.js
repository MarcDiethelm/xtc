var path = require('path');

module.exports = {

	/**
	 *
	 * @param {string} message – custom message
	 * @param {error} [originalError] – error object
	 * @param {string} [optionalMessage] displayed below the original error
	 * @returns {{c: string, web: string, code: string}}
	 */
	error: function(message, originalError, optionalMessage) {
		var  chalk = require('chalk')
			,err
			,originalMessage
		;

		message         = message || '';
		originalMessage = originalError && '\nReason: ' + originalError.message || '';
		optionalMessage = optionalMessage && '\n' + optionalMessage || '';

		err             = message + originalMessage + optionalMessage;

		return {
			 c: '\n'+ chalk.red(err)
			,web: 'production' !== process.env.NODE_ENV
				? '\n'+err.replace(/\n/g, '<br/>')
				: 'Error! Check the logs.'
			,code: originalError ? originalError.code : ''
		};
	},


	/**
	 * Add indentation to a multi-line string
	 * @param {string} sInput
	 * @param {number} levels – How many levels of indentation to apply
	 * @param {string} [indentString] – Character to use for indentation, defaults to tab char.
	 * @returns {string}
	 */
	indent: function(sInput, levels, indentString) {
		var indentedLineBreak;

		indentString = indentString || '\t';
		indentedLineBreak = '\n'+ ( new Array( levels + 1 ).join( indentString ) );

		return indentedLineBreak + sInput.split('\n').join(indentedLineBreak);
	},

	/**
	 * Construct an URI to the web view of the file or directory in a repository
	 * @param {string} baseUri – e.g. 'https://github.com/MarcDiethelm/xtc'
	 * @param {string} branch
	 * @param {string} filePath
	 * @param {string} [fileName]
	 * @returns {string} – URI to the web view of the file or directory in the repository
	 */
	getRepoWebViewUri: function(baseUri, branch, filePath, fileName) {
		var varPath = fileName ? 'blob/' : 'tree/'
		   ,branch = branch ? branch + '/' : 'develop'
		   ,filePath = path.relative(process.cwd(), filePath) + '/'
		;

		fileName = fileName || '';

		return baseUri ? baseUri + varPath + branch + filePath + fileName : null;
	}
}
