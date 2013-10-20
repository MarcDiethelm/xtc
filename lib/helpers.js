module.exports = function(cfg) {

	var  assert = require('assert')
		,express = require('express')
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

		docTitle: function(pageName) { // todo: should probably be a template helper...
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
					,img: (cfg.staticUriPrefix || '/') + cfg.static.img
					// generated assets
					,build: {
						// if staticUriPrefix is empty, add a root slash. So that pages on a path can get the assets
						js: {
							external: (cfg.staticUriPrefix || '/') + cfg.static.build.baseDirName +'/'+ cfg.static.build.js.external[NODE_ENV]
						}
						,css: {
							external: (cfg.staticUriPrefix || '/') + cfg.static.build.baseDirName +'/'+ cfg.static.build.css.external[NODE_ENV]
						}
					}
				}
			};
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
