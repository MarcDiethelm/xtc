module.exports = function(app) {

	/**
	 * user-defined routes
 	 */

	var index = require('./index')(app);

	app.get('/', index.home);
	app.get('/subpage', index.aSubpage);
	app.get('/subpage-alternate', index.aSubpageAlternate);
	app.get('/data/:someParam', app.authBasic('user'), index.data);

	/**
	 * default routes
 	 */

	var _default = require('./_default')(app);

	app.get('/_home', _default._home);
	app.get('/_view/:name', _default._getView);
	app.get('/_module/:name/:template', _default._getModule);
	app.get('/_test', _default._getModuleTest);

	// catch-all routes
	app.get('/:pageName', _default._subPage);
	app.post('/:pageName', _default._subPage);

	// final middleware
	app.render404 = _default.render404;


	if (app.cfg.allowAuthBypassForIpRanges) {

		// Populate the request IP with X-FORWARDED-FOR header if a proxy added one, or else the IP will be wrong.
		// Needed for authBasic helper to allow bypassing authentication for configurable IPs.
		// NOTE: This header is easily forged!

		app.enable('trust proxy');
	}
};
