module.exports = function(app) {

	/**
	 * user-defined routes
 	 */

	var index = require('./../controllers/index')(app);

	app.get('/', index.home);
	app.get('/subpage', index.aSubpage);
	app.get('/subpage-alternate', index.aSubpageAlternate);
	app.get('/data/:someParam', app.authBasic('user'), index.data);

	/**
	 * default routes
 	 */

	var _default = require('./../controllers/_default')(app);

	app.get('/_home', _default._home);
	app.get('/_view/:name', _default._getView);
	app.get('/_module/:name/:template', _default._getModule);
	// catch-all routes
	app.get('/:pageName', _default._subPage);
	app.post('/:pageName', _default._subPage);

	// final middleware
	app.render404 = _default.render404;
};
