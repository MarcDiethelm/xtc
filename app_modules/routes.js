/**
 * Routes
 */

var  express = require('express')
	,auth = express.basicAuth
	// todo: improve this great example of bad security
	,authUser = 'admin'
	,authPsw = '03666aab1ef552643be03d238d446'
;

module.exports = function(app) {

	/**
	 * user-defined routes
 	 */

	var index = require('./../controllers/index')(app);

	app.get('/', index.home);
	app.get('/subpage', index.aSubpage);
	app.get('/subpage-alternate', index.aSubpageAlternate);
	app.get('/data/:someParam', auth(authUser, authPsw), index.data);

	/**
	 * default routes
 	 */

	var _default = require('./../controllers/_default')(app);

	app.get('/_home', _default._home);
	app.get('/_view/:name', _default._getView);
	app.get('/_module/:name/:template', _default._getModule);
	app.get('/:pageName', _default._subPage); // catch-all route

	// final middleware
	app.render404 = _default.render404;
};
