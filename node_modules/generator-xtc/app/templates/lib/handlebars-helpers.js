/**
 * This module is for you to add your template helpers.
 * Below are some examples how to do it.
 * Refer to http://handlebarsjs.com/#helpers for more info about Handlebars helpers
 *
 * The helpers defined in this file are included and registered with Handlebars in xtc's /lib/handlebars-helpers-xtc.js.
 */

var NODE_ENV = process.env.NODE_ENV;
var helpers = {};
var handlebars;

module.exports = function(_handlebars) {
	var  helperNames = Object.keys(helpers)
		,i
	;

	handlebars = _handlebars;

	for (i = 0; i < helperNames.length; i++) {
		handlebars.registerHelper(helperNames[i], helpers[helperNames[i]]);
	}
};

/**
 * Filler text helper
 * See: https://github.com/MarcDiethelm/Hipsum.js
 * @author xtc
 * @type {function}
 */
helpers.filler = require('hipsum')();


/**
 * Log template data to console.
 * // This implementation overwrites a predefined version from xtc
 * @param {...*} obj — Arguments to console.log
 * @author xtc
 * Usage in template: {{log [...obj]}}
 */
helpers.log = function log(obj) {
	var input = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
	console.log.apply( console, input );
};


/**
 * JSON.stringify a JS object into a template
 * @param obj
 * @returns {SafeString}
 * @author xtc
 */
helpers.stringify = function stringify(obj) {
	try {
		return new handlebars.SafeString( JSON.stringify(obj) );
	}
	catch (e) {
		var err = utils.error('Handlebars helper stringify', e);
		console.error(err.c);
		return new handlebars.SafeString( err.web );
	}
};


/**
 * Escape HTML special characters to entities.
 * Useful when creating web style guides.
 * @param options
 * @returns {SafeString}
 * @author xtc
 */
helpers.htmlEntities = function stringify(options) {
	return new handlebars.SafeString( handlebars.Utils.escapeExpression( options.fn() ) );
};


/**
 * Environment mode block helper
 * Return the rendered block content if the block argument matches the NODE_ENV variable
 * // This implementation overwrites a predefined version from xtc
 * @param name {String} The block argument, 'development' or 'production'
 * @param options {Object} The block options. Contains block content as a compiled Handlebars template function.
 * @returns {String} Empty or rendered block content
 * @author xtc
 */
helpers.env = function(name, options) {
	// return the block contents only if the name matches NODE_ENV ('development', 'production', etc.)
	return name == NODE_ENV ? options.fn(this) : '';
};
