
module.exports = function(app) {

	var docTitle = app.docTitle;

	return {

		/**
		 * User-defined route controllers
		 * View and template locations are relative to app.config.templateBaseDir
		 */

		 // render home.hbs and include it in the default template (defined in config.js)
		home: function(req, res, next) {
			res.render('home');
		}
		
		 // Render a different view and include some data
		,aSubpage: function(req, res, next) {
			res.render('subpage', {
				 docTitle: docTitle('Subpage')
				,title: 'Subpage'
				,someData: 'A sub-page using default template'
			});
		}
		
		 // We can override the default template and use another. Protip: To not use any template, set layout: false
		,aSubpageAlternate: function(req, res, next) {
			res.set('Content-Type', 'image/svg+xml');
			res.render('subpage', {
				 layout: 'alternate'
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