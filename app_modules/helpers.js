module.exports = function(app) {

	var path = require('path');
	var hbs = require('hbs');

	return {
		configAbsolutePaths: function() {
				var paths = app.config.paths
					,pathName
				;
				for (pathName in paths) {

					paths[pathName] = this.localPathToAbsolute(paths[pathName]);
				};
			},

		localPathToAbsolute: function(localPath) {
			return path.join( app.config.dirName, localPath);
		},

		/**
		 * Create URLs to asset files and make them available to templates through app.locals
		 */
		addDistFileNamesToLocals: function() {
			var  config = app.config.distFileNames
				,NODE_ENV = app.get('env')
			;
			// this could be created dynamically depending on config properties
			app.locals.assets = {
					js: {
						 inline: app.config.webPaths.dist + config.js.inline[NODE_ENV] // currently uused
						,external: app.config.webPaths.dist + config.js.external[NODE_ENV]
					}
					,css: {
						external: app.config.webPaths.dist + config.css.external[NODE_ENV]
					}
				}
		}
	};



}