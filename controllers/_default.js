

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

		/********************************************************************
		 * Default route controllers
		 */

		_home: function(req, res, next) {

			var wrench = require('wrench')
				,fs = require('fs')
				,modulePath = app.config.paths.module
				,views = wrench.readdirSyncRecursive(app.config.paths.views)
				,modules = fs.readdirSync(modulePath)
			;

			res.render('views/_app-home', {
				layout: false
				,docTitle: docTitle('Components Overview')
				,title: 'Components Overview'
				,views: views.filter(isUserView).map(file2ViewName)
				,modules: modules.filter(isModuleFolder).map(directory2ModuleName)
			});

			function isUserView(viewName) {
				return viewName.indexOf('_') === 0 ? false : true;
			}

			function isModuleFolder(folderName) {
				return folderName.indexOf('mod-') === 0 ? true : false;
			}

			function file2ViewName(file) {
				return {
					name: file.replace('.hbs', '')
					,git: app.config.repository && app.config.repository + app.config.paths.views + file
				}
			}

			function directory2ModuleName(dir) {
				return {
					name: dir.replace('mod-', '')
					,git: app.config.repository && app.config.repository + modulePath + dir
				};
			}
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
				,template: req.params.name
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

function docTitle(pageName) {
	return pageName + ' – ' + siteName;
}