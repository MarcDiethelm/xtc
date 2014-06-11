module.exports = function(app) {

	var  xtcPath = app.get('xtcPath')
		,cfg = require( app.xtcPath('lib/configure') ).get()
		,helpers = app.xtc.helpers
		,authBasic = helpers.authBasic
	;

	// Example: password protect the whole site (to set credentials: see _config/config-secret.json)
	// app.all('*', authBasic('user'), function(req, res, next) { next('route'); });


	/**
	 * project routes
 	 */

	var index = require('./index')(app);

	app.get('/', index.home);

	// Example: password protect a route (to set credentials: see _config/config-secret.json)
	// app.get('/admin', authBasic('admin'), index.admin);

	// Catch-all routes: If no defined route matches but the URI path matches a view name, that view is rendered.
	// If nothing matches, the final xtc middleware `helpers.render404` is called, which renders the 404 view.
};
