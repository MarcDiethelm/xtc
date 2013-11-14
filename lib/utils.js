module.exports = {
	/**
	 *
	 * @param message
	 * @param originalError
	 * @param optionalMessage
	 * @returns {{c: string, web: string, code: (*|code|code|code|code|code)}}
	 */
	error: function(message, originalError, optionalMessage) {
		var  err = ''
			,originalMessage
		;

		message         = message || '';
		originalMessage = originalError && ' \nReason: ' + originalError.message || '';
		optionalMessage = optionalMessage && ' \n' + optionalMessage || '';

		err             = message + originalMessage + optionalMessage;

		return {
			 c: err
			,web: '\n'+err
			,code: originalError && originalError.code || ''
		};
	}
}