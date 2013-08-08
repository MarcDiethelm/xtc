module.exports = function(cfg) {

	var  assert = require('assert')
		,path = require('path')
		,express = require('express')
		,handlebars = require('express3-handlebars').create({}).handlebars
		,fs = require('fs')
		,utils = require('./utils')
		,NODE_ENV = process.env.NODE_ENV
	;

	if (NODE_ENV == 'test') {
		NODE_ENV = 'development';
	}

	return {
		
		authBasic: function(userName) {
			assert(cfg.auth.basic[userName], 'Auth user "'+ userName + '" not defined in cfg.auth.basic');
			return express.basicAuth(userName, cfg.auth.basic[userName]);
		},

		docTitle: function(pageName) {
			return pageName + ' – ' + cfg.siteName;
		},

		/**
		 * Create some always available template vars for use with app.locals()
		 * e.g. create URLs to asset files
		 */
		makeLocals: function() {
			NODE_ENV == 'development' && (cfg.siteName += ' (Dev)');

			return {
				 lang: cfg.i18n.langDefault
				,docTitle: cfg.siteName
				,node_env: NODE_ENV
				// Asset URIs
				,'static': {
					 prefix: cfg.staticUriPrefix
					,img: path.join(cfg.staticUriPrefix, cfg.static.img)
					// generated assets
					,build: {
						// if staticUriPrefix is empty, add a root slash. So that pages on a path can get the assets
						js: {
							external: path.join(cfg.staticUriPrefix || '/', cfg.static.build.baseDirName, cfg.static.build.js.external[NODE_ENV])
						}
						,css: {
							external: path.join(cfg.staticUriPrefix || '/', cfg.static.build.baseDirName, cfg.static.build.css.external[NODE_ENV])
						}
					}
				}
			};
		},

		getHandlebarsHelpers: function() {
			var cache = {};
			
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
					//  return the template only if the name matches NODE_ENV ('development', 'production', etc.)
					return name == NODE_ENV ? options.fn(this) : '';
				},

				test: function(name, context) {
					var  file, template, err
					;
	
					if (NODE_ENV != 'development')
						return '';
	
					file = path.join(cfg.pathsAbsolute.templateBaseDir, cfg.viewsDirName, '_test-modules.hbs');
	
					try {
						template = fs.readFileSync(file, 'utf8');
					} catch (e) {
						err = utils.error('Can\'t read test template file.', e);
						console.error(err.c);
					}
					template = hbs.compile(template)({
						alterTitle: cfg.QUnitFE.alterTitle.toString()
						,showUi: cfg.QUnitFE.showUi
						,reorder: 'false'
					});
					return new handlebars.SafeString(template);
				}
			
			}
		}
	};

}
