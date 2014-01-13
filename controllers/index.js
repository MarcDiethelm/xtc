module.exports = function(app) {

	var docTitle = require('../lib/helpers.js').docTitle;

	return {

		/**
		 * User-defined route controllers
		 */

		 // render home.hbs and include it in the default layout (defined in config.js)
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
		
		 // We can override the default layout and use another. Protip: To not use any layout, set layout: false
		,aSubpageAlternate: function(req, res, next) {
			res.set('Content-Type', 'image/svg+xml');
			res.render('subpage', {
				 layout: 'alternate'
				,docTitle: docTitle('Subpage Alternate Layout')
				,someData: 'a sub-page using an alternate layout'
			});
		}
		
		// Or we can just send data
		,data: function(req, res, next) {
			res.json({someParam: req.params.someParam});
		}
	}
};