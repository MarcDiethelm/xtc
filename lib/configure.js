/**
 * Project configuration module
 * A standard config is automatically created from the configs specified in configs.json.
 * The standard config is cached on subsequent require's and available with .get()
 * Additional configs can be created with .merge()
 * @type {{merge: Function, get: Function}}
 */
var convict     = require('convict')
   ,path        = require('path')
   ,fs          = require('fs')
   ,pkg         = require('../package.json')

   ,projectConfig = {}
   ,dynamicDefaults = {
   	     appPath    : process.cwd()
		,xtcVersion : pkg.xtcVersion
		,configPath : pkg.configPath
   }
   ,projectConfigPath = pkg.configPath
   ,projectConfigNames = require( path.join(dynamicDefaults.appPath, projectConfigPath, 'configs.json') )
;


/**
 * Create a configuration from different files (as available).
 * @param {String} configPath
 * @param {Array} configNames
 * @param {Object} [config] – Optional config to inherit, defaults to projectConfig
 * @returns {Object} – Convict configuration object
 */
var mergeConfigs = function(configPath, configNames, config) {
	var configsUsed = [];

	config = convict(config || projectConfig);
	//configPath = path.join(config.get('appPath'), configPath);
	configPath = path.join(process.cwd(), configPath);
	configNames = configNames || [];

	configNames.forEach(function(configName) {
		var file = path.join(configPath, 'config-'+configName);
		file += configName === 'default' ? '.js' : '.json';

		if (fs.existsSync(file)) {

			if (configName === 'default') {
				config = convict( require(file) );
				config.load(dynamicDefaults);
			}
			else {
				config.loadFile( file );
			}

			// logging
			configName === 'default' ? configsUsed.push('xtc defaults') : configsUsed.push(configName);
		}
	});

	try {
		config.validate();
	}
	catch (e) {
		// If not in test mode; print validation errors and exit.
		if (process.env.NODE_ENV && process.env.NODE_ENV !== 'test') {
			console.error('\nConfiguration error(s):\n' + e.message);
			process.exit(1);

		}
	}

	// be informative
	process.env.NODE_ENV && process.env.NODE_ENV !== 'test'
		&& configsUsed.push('env')
		&& console.log('configuration:', configsUsed.join(' < '));

	return config;
};


/**
 * Build some paths and create absolute paths from the cfg.paths using our base path
 */
var configurePaths = function configurePaths(cfg) {
	var  paths = cfg.get('paths')
		,baseDirName = process.env.NODE_ENV == 'development' ? 'baseDirNameDev' : 'baseDirNameDist'
	;

	cfg.set('buildUriPrefix', cfg.get('staticUriPrefix') + '/' + cfg.get('static.build')[baseDirName] +'/');

	// Create absolute paths

	for (pathName in paths) {
		cfg.set( 'pathsAbsolute.'+pathName, path.join( cfg.get('appPath'), paths[pathName]) );
	}

	return cfg;
};


// Create the project config.
projectConfig = mergeConfigs( projectConfigPath, projectConfigNames );
projectConfig = configurePaths(projectConfig).root(); // todo: remove root when implementing full convict integration


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
		return configurePaths(merged).root(); // todo: remove root when implementing full convict integration
	}
	/**
	 * Get the cached project configuration
	 * @returns {Object} – project configuration
	 */
	,get: function() {
		return projectConfig;
	}
};