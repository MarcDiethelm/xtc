module.exports = {
	/**
	 *
	 * @param message
	 * @param originalError
	 * @param optionalMessage
	 * @returns {{c: string, web: string, code: (*|code|code|code|code|code)}}
	 */
	error: function(message, originalError, optionalMessage) {
		var err = ''
			,originalMessage = originalError && originalError.message || ''
		;
		message = message || '';
		err += message + ' \nReason: ' + originalMessage;
		optionalMessage &&
			(err += ' \n' + optionalMessage);

		return {
			c: err
			,web: '\n'+err
			,code: originalError.code
		};
	}
}