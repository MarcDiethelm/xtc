var path = require('path')
	,_ = require('lodash')
	,fs = require('fs')
	,config = {}

config.dirname = fs.realpathSync('.'); // the absolute path to the app. our base path.

module.exports = {

	merge: function(configPath, configNames) {
		mergeConfigs(configPath, configNames);
		configAbsolutePaths();
		return module.exports;
	}
	,get: function() {
		return config;
	}
};


/**
 * Create one configuration from the different files as available.
 */
var mergeConfigs = function(configPath, configNames) {
	var configsUsed = [];
	configPath = path.join(config.dirname, configPath);
	configNames = configNames || [];

	configNames.forEach(function(configName) {
		var file = path.join(configPath, 'config-'+configName+'.js');

		if (fs.existsSync(file)) {
			configsUsed.push(configName);
			config = _.merge( config, require(file) );
		}
	});
	process.env.NODE_ENV && process.env.NODE_ENV != 'test' && console.log('Configuration:', configsUsed.join(' < '));
};


/**
 * Convert all relative paths in config.js to absolute paths using our base path
 */
var configAbsolutePaths = function() {
	var paths = config.paths
		,pathName
	;
	config.pathsAbsolute = {};

	for (pathName in paths) {
		config.pathsAbsolute[pathName] = path.join( config.dirname, paths[pathName]);
	}
};