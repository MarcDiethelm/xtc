module.exports = modHelper;

var  handlebars = require('handlebars')
	,renderModule = require('./mod-render')()
;


/**
 * This is executed when a {{mod}} helper tag is encountered in a template.
 * @param {string} name - Terrific module name
 * @returns {handlebars.SafeString}
 */
function modHelper(name) {

	var  options
	// the last argument always is a hash of key/value parameters passed into the helper
		,argLen = arguments.length
		,hash = arguments[argLen-1].hash
		,args = {}
	;

	argLen >= 2 && (args.name = arguments[0]);

	options = {
		name           : args.name || hash.name
		,template       : hash.template
		,tag            : hash.tag
		,id             : hash.id
		,classes        : hash.classes || hash.htmlClasses
		,skins          : hash.skins && hash.skins.replace(' ', '').split(',') || undefined
		,_isLayout      : hash._isLayout
		,noWrapper      : hash.noWrapper
		,data           : hash.data && evaluateDataAttr(hash.data, args, hash)
		,connectors     : hash['data-connectors'] // save for module testing
		,indent         : hash.indent
	};

	// convert remaining unhandled properties to html attributes
	// by storing them in an array containing objects with 'key' and 'value' properties

	delete hash.name;
	delete hash.template;
	delete hash.tag;
	delete hash.id;
	delete hash.classes;
	delete hash.htmlClasses;
	delete hash.skins;
	delete hash._isLayout;
	delete hash.noWrapper;
	delete hash.data;
	delete hash.indent;

	options.attributes = [];

	for (var i=0, keys = Object.keys(hash), numKeys = keys.length; i < numKeys; i++) {
		options.attributes.push({ key: keys[i], value: hash[keys[i]]});
	}

	return new handlebars.SafeString( renderModule(this, options) );
}


/**
 *
 * @param dataAttr
 * @param args
 * @param hash
 * @returns {obj}
 */
function evaluateDataAttr(dataAttr, args, hash) {
	if (typeof dataAttr === 'object') {
		return dataAttr;
	}
	else if (typeof dataAttr === 'string') {
		try {
			return (new Function('return '+ dataAttr))(); // "eval" in a private scope
		} catch (e) {
			throw new RenderError('Unable to evaluate module data attribute. Module: ' + (args.name || hash.name) +'\n'+ e.toString().replace(/^ReferenceError/, 'Reason') + '\n==> Use an object or object literal');
		}
	}
}