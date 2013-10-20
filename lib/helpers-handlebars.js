var  hbs = require('express3-handlebars').create({})
	,handlebars = hbs.handlebars
	,path = require('path')
	,fs = require('fs')
	,NODE_ENV = process.env.NODE_ENV
;

if (NODE_ENV == 'test') {
	NODE_ENV = 'development';
}

module.exports = function(cfg) {
	var cache = {}
		,testTemplate
	;

	if (NODE_ENV == 'development') {
		hbs.loadTemplate(path.join(cfg.pathsAbsolute.views, '_test-modules.hbs'), function(err, template) {
			testTemplate = template;
		})
	}

	return {

		/**
		 * Inline assets Handlebars block helper 
		 * Output a generated CSS or JS asset for inline use.
		 * @param inlineAssetName {String} E.g. 'css' or 'js'
		 * @returns {handlebars.SafeString}
		 */
		inline: function(inlineAssetName) {
			var  file = path.join(cfg.pathsAbsolute.staticBaseDir, cfg.static.build.baseDirName, cfg.static.build[inlineAssetName].inline[NODE_ENV])
				,cached = cache[inlineAssetName]
				,err
			;

			if (NODE_ENV == 'development' || !cached && cached !== '') {
				try {
					//console.log('read inline asset "'+ inlineAssetName +'" from:', file)
					cached = cache[inlineAssetName] = fs.readFileSync(file, 'utf8');
				} catch (e) {
					err = utils.error('Can\'t read inline asset file.', e);
					console.error(err.c);
					cached = '';
				}
			}
			return new handlebars.SafeString(cached);
		},

		/**
		 * Environment mode block helper
		 * return the rendered block content if the block argument matches the NODE_ENV variable
		 * @param name {String} The block argument, 'development' or 'production'
		 * @param options {Object} The block options. Contains block content as a compiled Handlebars template function.
		 * @returns {String} Empty or rendered block content
		 */
		env: function(name, options) {
			// return the template only if the name matches NODE_ENV ('development', 'production', etc.)
			return name == NODE_ENV ? options.fn(this) : '';
		},

		/**
		 * Log template data to console.
		 * @param {...*} obj — Arguments to console.log
		 */
		log: function(obj) {
			var input = Array.prototype.slice.call(arguments, 0, arguments.length - 1);
			console.log.apply( console, input );
		},

		test: function() {

			if (NODE_ENV != 'development' || !cfg.enableModuleTesting)
				return '';

			var tmp = testTemplate({
				 alterTitle: cfg.QUnitFE.alterTitle.toString()
				,consoleOutput: cfg.QUnitFE.consoleOutput.toString()
				,showUi: cfg.QUnitFE.showUi
				,reorder: 'false'

			});
			return new handlebars.SafeString(tmp);
		},
		
		filler: require('hipsum')()
	
	}
}