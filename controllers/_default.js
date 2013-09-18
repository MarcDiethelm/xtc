module.exports = function(app) {

	var  cfg = app.cfg
		,path = require('path')
		,utils = require(path.join(cfg.dirname, '/lib/utils.js'))
		,docTitle = app.docTitle
	;

	return {

		/********************************************************************
		 * Default route controllers
		 */

		_home: function(req, res, next) {
			var overview = require(path.join(cfg.dirname, 'lib/overview.js'))(cfg);

			res.render('_app-overview', {
				 layout: false
				,docTitle: docTitle('Components Overview')
				,title: 'Components Overview'
				,views: overview.views
				,templates: overview.templates
				,modules: overview.modules
			});
		}

		,_getView: function(req, res, next) {
			var layout = cfg.defaultTemplateName;

			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				layout = false;
			}
			res.render(req.params.name, {
				 layout: layout
				,docTitle: docTitle('View: '+ req.params.name)
				,uri: req.originalUrl
				,skipModules: 'solo' in req.query && 'layout'
			});
		}

		,_getModule: function(req, res, next) {
			var context = {}
				,key, val
				,module = app.terrific.renderModule(
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
				res.locals(app.locals);
				res.locals({
					layout: false
					,docTitle: docTitle('Module: '+ req.params.name +', Template: '+ req.params.template)
					,body: module
					,exclusive: req.params.name
					,skipModules: true
				});

				app.hbs.render(path.join(cfg.paths.templates, cfg.defaultTemplateName + '.hbs'), res.locals,
					function(err, html) {
						if (err) {
							var error = utils.error('Unable to render the module in the default template', err);
							console.error(error.c);
							html = error.web;
						}
						res.send(html);
					}
				);
			}
		}

		,_getModuleTest: function(req, res, next) {
			var test = req.query.url;

			var output = ''
				,modules = []
			;
			app.tests[test].forEach(function(options) {
				output += app.terrific.renderModule(app.locals, options);
				modules.push({
					 name:      options.name
					,template:  options.template
					,skins:     options.skins
					,connectors:options.connectors
				})
			});

			res.locals(app.locals);
			res.locals({
				layout: false
				,body: '<script>var xtc = {isTest: true, testModules: '+ JSON.stringify(modules) +'}</script>\n\n'+ output
				 // Prevent initializing testing in the test frame by overwriting the handlebars helper 'test'.
				,helpers: { test: null }
			});

			app.hbs.render(path.join(cfg.pathsAbsolute.templates, cfg.defaultTemplateName + '.hbs'), res.locals,
				function(err, html) {
					if (err) {
						var error = utils.error('Unable to render the modules in the default template', err);
						console.error(error.c);
						html = error.web;
					}
					res.send(html);
				}
			);
		}


		 // Look for a view with the name supplied by the catch-all route
		,_subPage: function(req, res, next) {
			try {
				res.render(req.params.pageName, {
					 docTitle: docTitle(req.params.pageName)
					,uri: req.originalUrl
				});
			} catch (e) {
				if (e.message == 'missing path')
					app.render404(req, res, next);
				else next(e);
			}
		}

		/////////////////////////////////////////////////////////////////////

		// If no Express middleware sends a response before, this middleware is finally called.
		,render404: function(req, res, next) {
			res.status(404)
				.render(
				'404'
				,{
					 docTitle: docTitle('404')
					,uri: req.originalUrl
				}
			);
		}
	}
};