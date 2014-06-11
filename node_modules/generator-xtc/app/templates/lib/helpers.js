/**
 * This module is for you to add your helper functions, e.g. for use in route controllers.
 */

var siteName;
var helpers = {};

module.exports = function(app) {

	var  helperNames = Object.keys(helpers)
		,i
	;

	for (i = 0; i < helperNames.length; i++) {
		app.xtc.helpers[ helperNames[i] ] = helpers[ helperNames[i] ];
	}

	// Change the site name for development mode
	siteName = app.xtc.cfg.get('siteName')
		+ ('development' === process.env.NODE_ENV
			? ' [dev]'
			: ''
		)
	;

	// Remember modified site name.
	// Used as app.locals.docTitle template var in server.js.
	app.xtc.cfg.set('siteName', siteName);
};

// Overwrite xtc's default docTitle function here.
helpers.docTitle = function docTitle(pageName) {
	return pageName + ' – ' + siteName;
};