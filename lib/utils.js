module.exports = {

	error: function(message, originalError) {
		var err = ''
			,originalMessage = originalError && originalError.message || ''
		;
		message = message || '';
		err += message + ' \nReason: ' + originalMessage;
		return {
			c: err
			,web: '\n'+err
			,code: originalError.code
		};
	}
}