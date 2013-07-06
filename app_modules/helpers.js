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
		err += message + ' \nReason: ' + originalMessage;
		return {
			c: err
			,web: '\n'+err
			,code: originalError.code
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
					 'config-default.js'
					,'config-project.js'
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

		docTitle: function(pageName) {
			return pageName + ' – ' + app.locals.docTitle;
		},

		/**
		 * Set some always available template vars through app.locals
		 * e.g. create URLs to asset files
		 */
		setLocals: function () {
			var siteName = app.config.siteName
				,static_ = app.config.static
			;
			app.settings.env == 'development' && (siteName += ' (Dev)');

			// Template data that is always available
			app.locals({
				 lang: app.config.i18n.langDefault
				,docTitle: siteName
				,node_env: NODE_ENV
				// Asset URIs
				,'static': {
					 prefix: app.config.staticUriPrefix
					,img: path.join(app.config.staticUriPrefix, static_.img)
					// generated assets
					,build: {
						js: {
							external: path.join(app.config.staticUriPrefix, static_.build.js.external[NODE_ENV])
						}
						,css: {
							external: path.join(app.config.staticUriPrefix, static_.build.css.external[NODE_ENV])
						}
					}
				}
			});
		},

		registerTemplateHelpers: function() {
			var cache = {};

			hbs.registerHelper('inline', function(inlineAssetName) {
				var  file = path.join(app.config.pathsAbsolute.staticBaseDir, app.config.static.build[inlineAssetName].inline[NODE_ENV])
					,cached = cache[inlineAssetName]
				;

				if (NODE_ENV == 'development' || !cached && cached !== '') {
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

				file = path.join(app.config.pathsAbsolute.templateBaseDir, app.config.viewsDirName, '_test-modules.hbs');

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
