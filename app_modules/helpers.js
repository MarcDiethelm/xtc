module.exports = function(app) {

	var path = require('path');

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
		}
	};



}