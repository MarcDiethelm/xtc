module.exports = function(app) {

	/**
	 * xtc routes
 	 */

	var xtc = require('./xtc')(app);

	app.get('/xtc', xtc.overview);
		app.get('/_home', function(res) { res.redirect(301, '/xtc') });
	app.get('/xtc/view/:view', xtc.getView);
	app.get('/xtc/module/:module/:template', xtc.getModule);
	app.get('/xtc/layout/:layout', xtc.getLayout);
	app.get('/xtc/test', xtc.getModuleTest);

	// catch-all routes
	app.get('/:view', xtc.autoRoute);
	app.post('/:view', xtc.autoRoute);

	// If no route matches, the final middleware `helpers.render404` is called.
};
