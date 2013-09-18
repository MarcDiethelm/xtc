module.exports = function(cfg) {

	var  assert = require('assert')
		,path = require('path')
		,fs = require('fs')
		,express = require('express')
		,hbs = require('express3-handlebars').create({})
		,handlebars = hbs.handlebars
		,rangeCheck
		,utils = require('./utils')
		,NODE_ENV = process.env.NODE_ENV
	;

	if (NODE_ENV == 'test') {
		NODE_ENV = 'development';
	}

	return {
		
		authBasic: function(userName) {
			assert(cfg.auth.basic[userName], 'Auth user "'+ userName + '" not defined in cfg.auth.basic');

			var basicAuth = express.basicAuth(userName, cfg.auth.basic[userName]);

			if (cfg.allowAuthBypassForIpRanges) {
				rangeCheck = require('range_check');
				return smartAuth(basicAuth);
			}
			else {
				return basicAuth;
			}
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
					,img: path.join(cfg.staticUriPrefix || '/', cfg.static.img)
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
				}
			
			}
		},

		registerModuleTestTrackingMiddleware: function(app) {
			if (!cfg.enableModuleTesting)
				return;

			app.tests = {};

			// Attach a global callback to set up module testing, then continue to user route callbacks.
			app.all('*', function(req, res, next) {
				var test = app.tests[req.url] = [];
				res.locals({
					addTest: function(cacheKey) {
						test.push(cacheKey)
					}
				});
				next('route');
			});
		}
	};


	function smartAuth(basicAuth) {

		var  ip = cfg.auth.ip
			,authNeeded = true
			,isValidIp
		;

		return function(req, res, next) {

			// If there are defined IP ranges, that are allowed to bypass authentication, do an IP check
			if (ip.length) {
				isValidIp = rangeCheck.valid_ip(req.ip);

				if ( isValidIp ) {
					if ( rangeCheck.in_range(req.ip, ip) ) {
						authNeeded = false;
					}
				} else {
					console.log('ip invalid:', req.ip);
				}
			}

			if (authNeeded) {
				basicAuth(req, res, function(err) {
					next();
				});
			} else {
				next();
			}
		}

	}

}
