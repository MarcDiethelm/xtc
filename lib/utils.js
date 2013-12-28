module.exports = {

	/**
	 *
	 * @param {string} message – custom message
	 * @param {error} originalError – error object
	 * @param {string} [optionalMessage] displayed below the original error
	 * @returns {{c: string, web: string, code: string}}
	 */
	error: function(message, originalError, optionalMessage) {
		var  err
			,originalMessage
		;

		message         = message || '';
		originalMessage = originalError && ' \nReason: ' + originalError.message || '';
		optionalMessage = optionalMessage && ' \n' + optionalMessage || '';

		err             = message + originalMessage + optionalMessage;

		return {
			 c: err
			,web: '\n'+err.replace(' \n', '<br>')
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
	}
}