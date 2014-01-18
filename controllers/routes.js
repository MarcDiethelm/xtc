module.exports = function(app) {

	var  cfg = require('../lib/configure').get()
		,helpers = require('../lib/helpers.js')
		,authBasic = helpers.authBasic
	;

	// password protect the whole site (to set credentials: see _config/config-secret.json)
	// app.all('*', authBasic('user'), function(req, res, next) { next('route'); });



	/**
	 * user-defined routes
 	 */

	var index = require('./index')(app);

	app.get('/', index.home);
	// password protect a route (to set credentials: see _config/config-secret.json)
	//app.get('/admin', authBasic('admin'), index.admin);

	/**
	 * default routes
 	 */

	var _default = require('./_default')(app);

	app.get('/_home', _default._home);
	app.get('/_view/:view', _default._getView);
	app.get('/_module/:module/:template', _default._getModule);
	app.get('/_layout/:layout', _default._getLayout);
	app.get('/_test', _default._getModuleTest);

	// catch-all routes
	app.get('/:view', _default._subPage);
	app.post('/:view', _default._subPage);

	// If no route matches, the final middleware `helpers.render404` is called.


	if (cfg.allowAuthBypassForIpRanges) {

		// Populate the request IP with X-FORWARDED-FOR header if a proxy added one, or else the IP will be wrong.
		// Needed for authBasic helper to allow bypassing authentication for configurable IPs.
		// NOTE: This header is easily forged!

		app.enable('trust proxy');
	}
};
