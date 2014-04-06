var  handlebars = require('handlebars')
	,exphbs = require('express3-handlebars')
	,hbs
	,path = require('path')
	,fs = require('fs')
	,utils = require('./utils')
	,cfg = require('./configure').get()
	,NODE_ENV = process.env.NODE_ENV
	,cache = {}
	,testTemplate
	,helpers = {}
	,userHelpersFile = path.join(cfg.appPath, '/lib/handlebars-helpers')
;

if (NODE_ENV !== 'production') NODE_ENV = 'development';

if (NODE_ENV == 'development') {
	hbs = exphbs.create({ handlebars: handlebars });
	hbs.loadTemplate(path.join(cfg.xtcPath, '/views/test-modules.hbs'), function(err, template) {
		testTemplate = template;
	});
}

// Handlebars helpers by xtc users
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

if (fs.existsSync(userHelpersFile)) {
	helpers = require(userHelpersFile);
}


// Handlebars helpers by xtc
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


helpers.mod = require('./mod-helper.js');


/**
 * Inline assets Handlebars block helper
 * Output a generated CSS or JS asset for inline use.
 * @param inlineAssetName {String} E.g. 'css' or 'js'
 * @returns {handlebars.SafeString}
 */
helpers.inline = function(inlineAssetName, options) {
	var file = cfg.build[inlineAssetName].inline
		,cached = cache[inlineAssetName]
		,content
		,err
	;

	if (NODE_ENV == 'development' || !cached && cached !== '') {
		try {
			//console.log('read inline asset "'+ inlineAssetName +'" from:', file)
			content = fs.readFileSync(file, 'utf8');
		} catch (e) {
			err = utils.error('Can\'t read inline '+ inlineAssetName +' file.', e, '==> Did you forget to run grunt?');
			console.error(err.c);
			cached = '';
		}
		
		if (content) {
			indentLevel = options.hash.indent || 0;
			content = utils.indent(content, indentLevel, cfg.indentString);
			cached = cache[inlineAssetName] = content;
		}
	}
	return new handlebars.SafeString(cached);
};


helpers.test = function() {
	if (NODE_ENV !== 'development' || !cfg.enableModuleTesting)
		return '';

	var tmp = testTemplate({
		 alterTitle: cfg.QUnitFE.alterTitle.toString()
		,consoleOutput: cfg.QUnitFE.consoleOutput.toString()
		,showUi: cfg.QUnitFE.showUi
		,reorder: 'false'
		,'static': {
			base: cfg.staticBaseUri
			,build: {test: cfg.testUri}
		}

	});
	return new handlebars.SafeString(tmp);
};


/**
 * Log template data to console.
 * @param {...*} obj — Arguments to console.log
 * @author xtc
 * Usage in template: {{log [...obj]}}
 */
module.exports.log = function log(obj) {
	var input = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
	console.log.apply( console, input );
};


/**
 * Environment mode block helper
 * Return the rendered block content if the block argument matches the NODE_ENV variable
 * @param name {String} The block argument, 'development' or 'production'
 * @param options {Object} The block options. Contains block content as a compiled Handlebars template function.
 * @returns {String} Empty or rendered block content
 * @author xtc
 */
helpers.env = function(name, options) {
	// return the block contents only if the name matches NODE_ENV ('development', 'production', etc.)
	return name == NODE_ENV ? options.fn(this) : '';
};


/**
 * Filler text helper
 * See: https://github.com/MarcDiethelm/Hipsum.js
 * @type {function}
 */
module.exports.filler = require('hipsum')();

//// end xtc Handlebars helpers


function registerHandlebarsHelpers(helpers) {
	var  helperNames = Object.keys(helpers)
		,i
	;

	for (i = 0; i < helperNames.length; i++) {
		handlebars.registerHelper(helperNames[i], helpers[helperNames[i]]);
	}
}


registerHandlebarsHelpers(helpers);
module.exports = handlebars;
