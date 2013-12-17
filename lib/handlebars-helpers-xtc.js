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
	,helpers
;

if (NODE_ENV == 'test') NODE_ENV = 'development';

if (NODE_ENV == 'development') {
	hbs = exphbs.create({ handlebars: handlebars });
	hbs.loadTemplate(path.join(cfg.pathsAbsolute.views, '_test-modules.hbs'), function(err, template) {
		testTemplate = template;
	});
}

// Handlebars helpers by xtc users
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

helpers = require('./handlebars-helpers-custom');


// Handlebars helpers by xtc
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


helpers.mod = require('./mod-helper.js');


/**
 * Inline assets Handlebars block helper
 * Output a generated CSS or JS asset for inline use.
 * @param inlineAssetName {String} E.g. 'css' or 'js'
 * @returns {handlebars.SafeString}
 */
helpers.inline = function(inlineAssetName) {
	var  file = path.join(cfg.pathsAbsolute.staticBaseDir, cfg.static.build.baseDirName, cfg.static.build[inlineAssetName].inline[NODE_ENV])
		,cached = cache[inlineAssetName]
		,err
	;

	if (NODE_ENV == 'development' || !cached && cached !== '') {
		try {
			//console.log('read inline asset "'+ inlineAssetName +'" from:', file)
			cached = cache[inlineAssetName] = fs.readFileSync(file, 'utf8');
		} catch (e) {
			err = utils.error('Can\'t read inline '+ inlineAssetName +' file.', e, '==> Did you forget to run grunt?');
			console.error(err.c);
			cached = '';
		}
	}
	return new handlebars.SafeString(cached);
};


helpers.test = function() {
	if (NODE_ENV != 'development' || !cfg.enableModuleTesting)
		return '';

	var tmp = testTemplate({
		 alterTitle: cfg.QUnitFE.alterTitle.toString()
		,consoleOutput: cfg.QUnitFE.consoleOutput.toString()
		,showUi: cfg.QUnitFE.showUi
		,reorder: 'false'
		,'static': { prefix: cfg.staticUriPrefix }

	});
	return new handlebars.SafeString(tmp);
};

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
