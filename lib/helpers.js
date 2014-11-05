var  assert = require('assert')
	,express = require('express')
	,path = require('path')
	,utils = require('./utils')
	,cfg = require('./configure').getRaw()
	,NODE_ENV = process.env.NODE_ENV
	,siteName
	,rangeCheck
	,cssUri
	,jsUri
	,assetsRegExp
;

if (NODE_ENV != 'production') { NODE_ENV = 'development' }

siteName = cfg.siteName
	+ ('development' === NODE_ENV
		? ' [dev]'
		: ''
	)
;

// for useful error message when an asset is not found
assetsRegExp = new RegExp(cfg.cssUri +'|'+ cfg.jsUri);


function getSmartAuth(basicAuth) {
	var authorizedIps = cfg.auth.ip;

	console.log('whitelisted IPs: %s\n', authorizedIps.join(', '));

	return function smartAuth(req, res, next) {
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
	};
}


module.exports.authBasic = function authBasic(userName) {
	var err;

	try {
		assert(cfg.auth.basic[userName], 'cfg.auth.basic["'+userName+'"] is undefined');
	}
	catch (e) {
		err = utils.error('\nBasic auth configuration error: No auth info for user name "'+ userName + '".', null, '==> Check "_config/config-secret.json" for how to fix it.' );
		console.error(err.c);
		throw(e);
		// process should exit now
	}

	var basicAuth = express.basicAuth(userName, cfg.auth.basic[userName]);

	if (cfg.allowAuthBypassForIpRanges) {
		rangeCheck = require('range_check');
		return getSmartAuth(basicAuth);
	}
	else {
		return basicAuth;
	}
};

/**
 * Joins the path where xtc resides with a supplied path. Used in scripts outside of xtc's folder.
 * @param {string} joinPath - The path to append to the xtc path.
 * @returns {string}
 */
module.exports.xtcPath = function(joinPath) {
	return path.join(cfg.xtcPath, joinPath);
};


/**
 * Joins the project root with a supplied path.
 * @param {string} joinPath - The path to append to the project path.
 * @returns {string}
 */
module.exports.projectPath = function(joinPath) {
	return path.join(cfg.appPath, joinPath);
};

/**
 * Format the document title. This function is a fallback that should be overridden by a user function in
 * project's helpers.
 * @param pageName
 * @returns {string}
 */
module.exports.docTitle = function docTitle(pageName) {
	return pageName + ' – ' + siteName;
};


/**
 * Create some always available template vars for use with app.locals()
 * e.g. create URLs to asset files
 */
module.exports.makeLocals = function() {

	return {
		 lang: cfg.i18n.langDefault
		,docTitle: siteName
		,node_env: NODE_ENV
		// Asset URIs
		,'static': {
			 base: cfg.staticBaseUri
			,img: cfg.staticBaseUri +'/'+ cfg.static.img
			// generated assets
			,build: {
				js: {
					external: cfg.jsUri
				}
				,css: {
					external: cfg.cssUri
				}
			}
		}
		,indent: cfg.indentLevel
	};
};


// If no Express middleware sends a response before, this middleware is finally called.
module.exports.render404 = function render404(req, res, next) {

	var  isAssetUri = assetsRegExp.test(req.url)
		,err
	;

	if (isAssetUri) {
		err = utils.error('404 NOT FOUND '+ req.url, null, '==> Did you forget to run grunt?');
		!process.env.testRun && console.error( err.c );
		res
			.type('text/plain')
			.send(404, err.web)
		;
	}
	else {
		res
			.status(404)
			.render('404', {
				 docTitle: exports.docTitle('404')
				,uri: req.originalUrl
			}
		);
	}
};


module.exports.error = function error(err, req, res, next) {
	var xtcErr;

	if (err.message && ~err.message.indexOf('Failed to lookup view')) {
		xtcErr = utils.error(err.message, null, 'Searched for '+ err.view.name + err.view.ext +' in:\n'+ err.view.root.join('\n'));
		console.error(xtcErr.c);
		sendSafeError(res, xtcErr.web);
	}
	else if (err.message && ~err.message.indexOf('_csrfSecret')) {
		xtcErr = utils.error('CSRF setup error', err, '==> CSRF requires cookieParser and session support');
		console.error(xtcErr.c);
		sendSafeError(res, xtcErr.web);
	}
	else {
		err.stack ? console.error(err.stack) : console.error(err);
		sendSafeError(res, err.message);
	}
};

function sendSafeError(res, errorMessage) {
	var safeWebMsg = 'Internal Server Error<br>\ncheck the server logs for more info';

	if ('production' !== NODE_ENV) {
		res.send(500, errorMessage);
	}
	else {
		res.send(500, safeWebMsg);
	}
}


module.exports.registerModuleTestTrackingMiddleware = function registerModuleTestTrackingMiddleware(app) {
	if (!cfg.enableModuleTesting || NODE_ENV === 'production')
		return;

	app.tests = {};

	// Attach a global callback to set up module testing, then continue to user route callbacks.
	app.use(function(req, res, next) {
		var test = app.tests[req.url] = [];
		res.locals({
			addTest: function(cacheKey) {
				test.push(cacheKey)
			}
		});
		next();
	});
};
