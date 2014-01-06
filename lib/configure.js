/**
 * Project configuration module
 * A standard config is automatically created from the configs specified in configs.json.
 * The standard config is cached on subsequent require's and available with .get()
 * Additional configs can be created with .merge()
 * @type {{merge: Function, get: Function}}
 */
var path = require('path')
	,_ = require('lodash-node')
	,fs = require('fs')

	,projectConfig = {
		appPath: process.cwd()
	}
	,projectConfigPath = '_config'
	,projectConfigNames = require( path.join(projectConfig.appPath, projectConfigPath, 'configs.json') )
;


/**
 * Create a configuration from different files (as available).
 * @param {String} configPath
 * @param {Array} configNames
 * @param {Object} [config] – Optional config to inherit, defaults to projectConfig
 * @returns {Object} – configuration
 */
var mergeConfigs = function(configPath, configNames, config) {
	var configsUsed = []
		,merged = {}
	;

	config = config || projectConfig;
	configPath = path.join(config.appPath, configPath);
	configNames = configNames || [];

	configNames.forEach(function(configName) {
		var file = path.join(configPath, 'config-'+configName+'.js');

		if (fs.existsSync(file)) {
			_.merge( merged, config, require(file) );
			// logging
			config === merged ? configsUsed.push(configName) : configsUsed.push('xtc defaults');
			// persist into next iteration
			config = merged;
		}
	});

	// be informative
	process.env.NODE_ENV && process.env.NODE_ENV != 'test' && console.log('Configuration:', configsUsed.join(' < '));

	return merged;
};


/**
 * Build some paths and create absolute paths from the cfg.paths using our base path
 */
var configurePaths = function(cfg) {
	var paths = cfg.paths
		,baseDirName = process.env.NODE_ENV == 'development' ? 'baseDirNameDev' : 'baseDirNameDist'
	;

	cfg.buildUriPrefix = cfg.staticUriPrefix + '/' + cfg.static.build[baseDirName] +'/';

	cfg.pathsAbsolute = {};

	// Create absolute paths

	for (pathName in paths) {
		cfg.pathsAbsolute[pathName] = path.join( cfg.appPath, paths[pathName]);
	}

	return cfg;
};

// Create the project config.
projectConfig = mergeConfigs( projectConfigPath, projectConfigNames );
projectConfig = configurePaths(projectConfig);


module.exports = {

	/**
	 * Create a configuration from different files (as available).
	 * @param {String} configPath
	 * @param {Array} configNames
	 * @param {Object} [config] – Optional config to inherit, defaults to projectConfig
	 * @returns {Object} – configuration
	 */
	merge: function(configPath, configNames, config) {
		var merged = mergeConfigs(configPath, configNames, config);

		return configurePaths(merged);
	}
	/**
	 * Get the cached project configuration
	 * @returns {Object} – project configuration
	 */
	,get: function() {
		return projectConfig;
	}
};