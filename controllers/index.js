

var siteName;

module.exports = function(app) {

	siteName = app.config.siteName;
	app.settings.env == 'development' && (siteName += ' – Dev');

	// Template data that is always available
	app.locals({
		 lang: app.config.i18n.langDefault
		,docTitle: siteName
	});

	return {

		/**
		 * User-defined route controllers
		 */

		 // render home.hbs and include it in the default template (defined in config.js)
		home: function(req, res, next) {
			res.render('views/home');
		}
		 // Render a different view and include some data
		,aSubpage: function(req, res, next) {
			res.render('views/subpage', {
				 docTitle: docTitle('Subpage')
				,someData: 'A sub-page using default template'
			});
		}
		 // We can override the default template and use another. Protip: To not use any template, set layout: false
		,aSubpageAlternate: function(req, res, next) {
			res.set('Content-Type', 'image/svg+xml');
			res.render('views/subpage', {
				 layout: 'templates/alternate'
				,docTitle: docTitle('Subpage Alternate Layout')
				,someData: 'a sub-page using alternate template'
			});
		}
		// Or we can just send data
		,data: function(req, res, next) {
			res.json({someParam: req.params.someParam});
		}
	}
};

function docTitle(pageName) {
	return pageName + ' – ' + siteName;
}