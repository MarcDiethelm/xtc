module.exports = function() {

	var  assert = require('assert')
		,express = require('express')
		,rangeCheck
		,utils = require('./utils')
		,NODE_ENV = process.env.NODE_ENV
		,cfg = require('./configure').get()
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
			var  uriPrefix = cfg.staticUriPrefix + '/'
				,baseDirName = NODE_ENV == 'development' ? 'baseDirNameDev' : 'baseDirNameDist'
			;

			NODE_ENV == 'development' && (cfg.siteName += ' (Dev)');

			return {
				 lang: cfg.i18n.langDefault
				,docTitle: cfg.siteName
				,node_env: NODE_ENV
				// Asset URIs
				,'static': {
					 prefix: cfg.staticUriPrefix
					,img: uriPrefix + cfg.static.img
					// generated assets
					,build: {
						js: {
							external: uriPrefix + cfg.static.build[baseDirName] +'/'+ cfg.static.build.js.external[NODE_ENV]
						}
						,css: {
							external: uriPrefix + cfg.static.build[baseDirName] +'/'+ cfg.static.build.css.external[NODE_ENV]
						}
					}
				}
				,indent: cfg.indentLevel
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
	// end exports


	function smartAuth(basicAuth) {
		var authorizedIps = cfg.auth.ip;

		return function(req, res, next) {
			var  authNeeded = true
				,isValidIp
			;

			// If there are defined IP ranges, that are allowed to bypass authentication, do an IP check
			if (authorizedIps.length) {
				isValidIp = rangeCheck.valid_ip(req.ip);

				if ( isValidIp ) {
					if ( rangeCheck.in_range(req.ip, authorizedIps) ) {
						authNeeded = false;
						'production' == NODE_ENV && console.log('Bypass basic auth for %s [%s] "%s"', req.ip, new Date().toUTCString(), req.get('User-Agent'));
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
