/**
 * This module is for you to add your template helpers.
 * Below is are two examples how to do it.
 */


/**
 * Log template data to console.
 * @param {...*} obj — Arguments to console.log
 * Usage in template: {{log [...obj]}}
 */
module.exports.log = function log(obj) {
	var input = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
	console.log.apply( console, input );
};


/**
 * JSON.stringify a JS object into a template
 * @param obj
 * @returns {SafeString}
 */
module.exports.stringify = function stringify(obj) {
	try {
		return new handlebars.SafeString( JSON.stringify(obj) );
	}
	catch (e) {
		var err = utils.error('Handlebars helper stringify', e);
		console.error(err.c);
		return new handlebars.SafeString( err.web );
	}
}