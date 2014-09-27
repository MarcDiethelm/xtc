module.exports = function(app) {

	var  cfg = require(app.xtcPath('lib/configure')).getRaw()
		,path = require('path')
		,fs = require('fs')

		,renderModule = require(app.xtcPath('lib/mod-render'))()
		,exphbs = require(app.xtcPath('node_modules/express-handlebars'))
		,utils = require(app.xtcPath('lib/utils'))
		,helpers = app.xtc.helpers
		,docTitle = helpers.docTitle
		,hbs
	 ;

	hbs = exphbs.create({
		handlebars: require(app.xtcPath('node_modules/handlebars'))
	});

	return {

		/********************************************************************
		 * Default route controllers
		 */

		overview: function(req, res, next) {
			var overview = require(app.xtcPath('lib/overview.js'))(cfg);

			res.render('overview', {
				 docTitle: docTitle('Components Overview')
				,title: 'Components Overview'
				,views: overview.views
				,layouts: overview.layouts
				,modules: overview.modules
				,skipModules: 'layout'
			});
		}

		,getView: function(req, res, next) {
			var layout = cfg.defaultLayoutName;

			if ('raw' in req.query) {
				res.setHeader('Content-Type', 'text/plain');
				layout = false;
			}
			res.render(req.params.view, {
				 layout: layout
				,docTitle: docTitle('View: '+ req.params.view)
				,uri: req.originalUrl
				,skipModules: 'solo' in req.query && 'layout'
			});
		}

		,getModule: function(req, res, next) {
			var module = renderModule(
					app.locals,
					{
						 name: req.params.module
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
					,docTitle: docTitle('Module: '+ req.params.module +', Template: '+ req.params.template)
					,body: module
					,exclusive: req.params.module
					,skipModules: true
				});

				hbs.render(path.join(cfg.sources.layouts, cfg.defaultLayoutName + cfg.templateExtension), res.locals)
					.then(function(html) {
						res.send(html);
					})
					.catch(function(err) {
						var error = utils.error('Unable to render the module in the default template', err);
						console.error(error.c);
						res.send(error.web);
					})
				;
			}
		}

		,getLayout: function(req, res, next) {
			res.locals(app.locals);
			res.locals({
				layout: false
				,docTitle: docTitle('Layout: '+ req.params.layout)
				,body: ''
			});

			hbs.render(path.join(cfg.sources.layouts, req.params.layout + cfg.templateExtension), res.locals)
				.then(function(html) {
					'raw' in req.query && res.setHeader('Content-Type', 'text/plain');
					res.send(html);
				})
				.catch(function(err) {
					var error = utils.error('Unable to render the layout', err);
					console.error(error.c);
					res.send(error.web);
				})
			;
		}

		,getModuleTest: function(req, res, next) {
			var  test = req.query.url
				,output = ''
				,modules = []
				,done = {}// keep track of handled module, to skip modules with identical options.
			;

			app.tests[test] && app.tests[test].forEach(function(options) {
				if (options.name+options.template+options.skins+options.connectors in done)
					return;

				output += renderModule(app.locals, options);
				modules.push({
					 name:      options.name
					,template:  options.template
					,skins:     options.skins
					,connectors:options.connectors
				});
				done[options.name+options.template+options.skins+options.connectors] = 1;
			});

			res.locals(app.locals);
			res.locals({
				 layout: false
				,body: '<script>var xtc = {isTest: true, testModules: '+ JSON.stringify(modules) +'}</script>\n\n'+ output
				 // Prevent initializing testing in the test frame by overwriting the handlebars helper 'test'.
				,helpers: { test: null }
			});

			hbs.render(path.join(cfg.sources.layouts, cfg.defaultLayoutName + cfg.templateExtension), res.locals)
				.then(function(html) {
					res.send(html);
				})
				.catch(function(err) {
					var error = utils.error('Unable to render the modules in the default template', err);
					console.error(error.c);
					res.send(error.web);
				})
			;
		}


		 // Look for a view with the name supplied by the catch-all route
		,autoRoute: function(req, res, next) {
			fs.exists(path.join(cfg.sources.views, req.params.view + cfg.templateExtension), function(exists) {
				if (exists) {
					try {
						res.render(req.params.view, {
							 docTitle: docTitle('View: '+ req.params.view)
							,uri: req.originalUrl
						});
					} catch (e) {
						return next(e);
					}
				}
				else {
					return helpers.render404(req, res, next);
				}
			});
		}
	}
};
