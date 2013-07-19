module.exports = function(cfg) {

	var path = require('path')
		,hbs = require('hbs')
		,fs = require('fs')
		,utils = require('./utils')
		,NODE_ENV = process.env.NODE_ENV
	;

	if (NODE_ENV == 'test') {
		NODE_ENV = 'development';
	}

	return {

		docTitle: function(pageName) {
			return pageName + ' – ' + cfg.siteName;
		},

		/**
		 * Create some always available template vars for use with app.locals()
		 * e.g. create URLs to asset files
		 */
		makeLocals: function() {
			NODE_ENV == 'development' && (cfg.siteName += ' (Dev)');

			return {
				 lang: cfg.i18n.langDefault
				,docTitle: cfg.siteName
				,node_env: NODE_ENV
				// Asset URIs
				,'static': {
					 prefix: cfg.staticUriPrefix
					,img: path.join(cfg.staticUriPrefix, cfg.static.img)
					// generated assets
					,build: {
						js: {
							external: path.join(cfg.staticUriPrefix, cfg.static.build.baseDirName, cfg.static.build.js.external[NODE_ENV])
						}
						,css: {
							external: path.join(cfg.staticUriPrefix, cfg.static.build.baseDirName, cfg.static.build.css.external[NODE_ENV])
						}
					}
				}
			};
		},

		registerTemplateHelpers: function() {
			var cache = {};

			hbs.registerHelper('inline', function(inlineAssetName) {
				var  file = path.join(cfg.pathsAbsolute.staticBaseDir, cfg.static.build.baseDirName, cfg.static.build[inlineAssetName].inline[NODE_ENV])
					,cached = cache[inlineAssetName]
					,err
				;

				if (NODE_ENV == 'development' || !cached && cached !== '') {
					try {
						//console.log('read inline asset "'+ inlineAssetName +'" from:', file)
						cached = cache[inlineAssetName] = fs.readFileSync(file, 'utf8');
					} catch (e) {
						err = utils.error('Can\'t read inline asset file.', e);
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
				var  file, template, err
				;

				if (NODE_ENV != 'development')
					return '';

				file = path.join(cfg.pathsAbsolute.templateBaseDir, cfg.viewsDirName, '_test-modules.hbs');

				try {
					template = fs.readFileSync(file, 'utf8');
				} catch (e) {
					err = utils.error('Can\'t read test template file.', e);
					console.error(err.c);
				}
				template = hbs.compile(template)({
					alterTitle: cfg.QUnitFE.alterTitle.toString()
					,showUi: cfg.QUnitFE.showUi
					,reorder: 'false'
				});
				return new hbs.SafeString(template);
			});
		}
	};

}
