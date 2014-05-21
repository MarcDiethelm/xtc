module.exports = function(app) {

	var docTitle = app.xtc.helpers.docTitle;

	return {

		/**
		 * User-defined route controllers
		 */

		 // render home.hbs and include it in the default layout (defined in config.js)
		home: function(req, res, next) {
			res.render('home', {
				//docTitle: docTitle('Home')
			});
		}
	}
};
