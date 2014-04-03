module.exports = function(app) {

	var docTitle = require(app.xtcPath('lib/helpers.js')).docTitle;

	return {

		/**
		 * User-defined route controllers
		 */

		 // render home.hbs and include it in the default layout (defined in config.js)
		home: function(req, res, next) {
			res.render('home');
		}
	}
};
