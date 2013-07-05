module.exports = function(app) {

	var path = require('path')
		,docTitle = app.helpers.docTitle
		,cfg = app.config
	;

	return {

		/********************************************************************
		 * Default route controllers
		 */

		_home: function(req, res, next) {
			var overview = require(path.join(cfg.dirname, 'app_modules/overview.js'))(app);

			res.render(path.join(cfg.viewsDirName, '_app-home'), {
				 layout: false
				,docTitle: docTitle('Components Overview')
				,title: 'Components Overview'
				,views: overview.views
				,modules: overview.modules
			});
		}

		,_getView: function(req, res, next) {
			var layout = cfg.defaultTemplate;

			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				layout = false;
			}
			res.render(path.join(cfg.viewsDirName, req.params.name), {
				 layout: layout
				,docTitle: docTitle('View: '+ req.params.name)
				,uri: req.originalUrl
				,skipModules: 'solo' in req.query && 'layout'
			});
		}

		,_getModule: function(req, res, next) {
			var module = app.terrific.renderModule(
					app.locals,
					{
						 name: req.params.name
						,template: req.params.template
					}
				)
			;

			if (module.error) {
				res.send(module.error.web);
				return;
			}

			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				res.send(module);
			} else {
				res.render(path.join(cfg.templatesDirName, cfg.defaultTemplateName), {
					layout: false
					,docTitle: docTitle('Module: '+ req.params.name +', Template: '+ req.params.template)
					,body: module
					,exclusive: req.params.name
					,skipModules: true
				});
			}

		}

		 // Look for a view with the name supplied by the catch-all route
		,_subPage: function(req, res, next) {
			try {
				res.render(path.join(cfg.viewsDirName, req.params.pageName), {
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