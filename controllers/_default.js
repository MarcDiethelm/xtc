

var siteName
	,path = require('path')
;

module.exports = function(app) {

	var docTitle = app.helpers.docTitle;

	return {

		/********************************************************************
		 * Default route controllers
		 */

		_home: function(req, res, next) {

			var overview = require(path.join(app.config.dirname, 'app_modules/overview.js'))(app);

			res.render('views/_app-home', {
				 layout: false
				,docTitle: docTitle('Components Overview')
				,title: 'Components Overview'
				,views: overview.views
				,modules: overview.modules
			});

		}

		,_getView: function(req, res, next) {
			var layout = app.config.defaultTemplate;

			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				layout = false;
			}
			res.render('views/' + req.params.name, {
				 layout: layout
				,docTitle: docTitle(req.params.name)
				,uri: req.originalUrl
			});
		}

		,_getModule: function(req, res, next) {
			var module = app.terrific.renderModule({
				 name: req.params.name
				,template: req.params.template
			});

			if (module.error) {
				res.send(module.error.web);
				return;
			}
			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				res.send(module);
			} else {
				res.render(app.config.defaultTemplate, {
					layout: false
					,docTitle: docTitle(req.params.name)
					,body: module
				});
			}

		}
		 // Look for a view with the name supplied by the catch-all route
		,_subPage: function(req, res, next) {
			try {
				res.render('views/'+ req.params.pageName, {
					 docTitle: docTitle(req.params.pageName)
					,uri: req.originalUrl
				});
			} catch (e) {
				// we never get here. either render succeeds or next() is called apparently. which is fine, because
				// the last defined middleware is render404.
			}
		}

		/////////////////////////////////////////////////////////////////////

		// If no Express middleware sends a response before, this middleware is finally called.
		,render404: function(req, res, next) {
			res.status(404)
				.render(
				'views/404'
				,{
					 docTitle: docTitle('404')
					,uri: req.originalUrl
				}
			);
		}
	}
};