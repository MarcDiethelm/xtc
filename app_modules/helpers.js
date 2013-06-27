module.exports = function(app) {

	var path = require('path')
		,hbs = require('hbs')
		,fs = require('fs')
		,utils = require('./utils')
		,NODE_ENV = app.get('env')
	;

	// todo: look at my other error utils.
	app.error = function(message, originalError) {
		var err = ''
			,originalMessage = originalError && originalError.message || ''
		;
		message = message || '';
		err += message + ' Reason: ' + originalMessage;
		return {
			c: err
			,web: '\n'+err
		};
	};


	return {

		/**
		 * Create one configuration from the different files as available.
		 */
		mergeConfigs: function(basePath, configPath) {
			var  config = {
					dirname: basePath // the absolute path to the app. our base path.
				}
				,configPath = path.join(basePath, configPath)
				,configs = [
					'config.js'
					,'config-secret.js'
					,'config-local.js'
				]
			;


			configs.forEach(function(filename) {
				var  file = path.join(configPath, filename)
				;

				if (fs.existsSync(file)) {
					config = utils.extend( config, require(file) );
				}
			});
			app.config = config;
		},
		/**
		 * Convert all relative paths in config.js to absolute paths using our base path
		 */
		configAbsolutePaths: function() {
			var paths = app.config.paths
				,pathName
			;
			app.config.pathsAbsolute = {};

			for (pathName in paths) {
				app.config.pathsAbsolute[pathName] = this.localPathToAbsolute(paths[pathName]);
			};
		},

		localPathToAbsolute: function(localPath) {
			return path.join( app.config.dirname, localPath);
		},

		/**
		 * Set some always available template vars through app.locals
		 * e.g. create URLs to asset files
		 */
		setLocals: function () {
			var siteName = app.config.siteName
				,assets = app.config.assets
			;
			app.settings.env == 'development' && (siteName += ' (Dev)');

			// Template data that is always available
			app.locals({
				 lang: app.config.i18n.langDefault
				,docTitle: siteName
				,node_env: NODE_ENV
				// this could be created dynamically depending on config properties(?)
				,assets: {
					js: {
						external: app.config.webPaths.dist + assets.js.external[NODE_ENV]
					}
					,css: {
						external: app.config.webPaths.dist + assets.css.external[NODE_ENV]
					}
					,img: app.config.webPaths.img
				}
			});
		},

		docTitle: function(pageName) {
			return pageName + ' – ' + app.locals.docTitle;
		},

		registerTemplateHelpers: function() {
			var cache = {};

			hbs.registerHelper('asset', function(inlineAssetName) {
				var  file = path.join(app.config.pathsAbsolute.dist, app.config.assets[inlineAssetName].inline[NODE_ENV])
					,cached = cache[inlineAssetName]
				;

				if (!cached && cached !== '') {
					try {
						//console.log('read inline asset "'+ inlineAssetName +'" from:', file)
						cached = cache[inlineAssetName] = fs.readFileSync(file, 'utf8');
					} catch (e) {
						err = app.error('Can\'t read inline asset file.', e);
						console.error(err.c);
						cached = '';
					}
				}
				return new hbs.SafeString(cached);
			});

			hbs.registerHelper('env', function(name, context) {
				//  return the template only if the name matches NODE_ENV ('development', 'production', etc.)
				return name == NODE_ENV ? context.fn(this) : '';
			});

			hbs.registerHelper('test', function(name, context) {
				var  file, template
					,config = app.config.QUnitFE
				;

				if (NODE_ENV != 'development')
					return '';

				file = path.join(app.config.pathsAbsolute.views, '_test-modules.hbs');

				try {
					template = fs.readFileSync(file, 'utf8');
				} catch (e) {
					err = app.error('Can\'t read test template file.', e);
					console.error(err.c);
				}
				template = hbs.compile(template)({
					alterTitle: config.alterTitle.toString()
					,showUi: config.showUi
					,reorder: 'false'
				});
				return new hbs.SafeString(template);
			});
		}
	};

}
