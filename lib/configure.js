/**
 * Project configuration module
 * A standard config is automatically created from the configs specified in configs.json.
 * The standard config is cached on subsequent require's and available with .get()
 * Additional configs can be created with .merge()
 * @type {{merge: Function, get: Function}}
 */
var nodeEnv     = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var convict     = require('convict');
var path        = require('path');
var fs          = require('fs');
var url         = require('url');
 // The path to the project files, including package.json containing configPath.
var appPath     = (process.env.testRun || process.env.xtcDev) ? path.resolve('./node_modules/generator-xtc/app/templates/') : process.cwd();
var xtcPath     = path.dirname(__dirname);
var pkg         = require(path.join(appPath, 'package.json'));
var xtcPkg      = require(path.join(xtcPath, 'package.json'));

var projectConfig = {};
var projectConfigPath = path.resolve(appPath, pkg.configPath);
var projectConfigNames;
var dynamicDefaults = {
        appPath    : appPath
       ,xtcPath    : xtcPath
       ,xtcVersion : xtcPkg.version
       ,configPath : projectConfigPath
   };
var err;


try {
	if (process.env.testRun || process.env.xtcDev) {
		projectConfigNames = require( path.join(projectConfigPath, 'configs.test.json') );
	}
	else {
		projectConfigNames = require( path.join(projectConfigPath, 'configs.json') );
	}
} catch (e) {
	err = require('./utils').error('Unable to load configuration', e, e.code === 'MODULE_NOT_FOUND' && 'Make sure "configPath" in package.json is correct.');
	console.error(err.c);
	process.exit(1)
}



/**
 * Create a configuration from different files (as available).
 * @param {String} configPath
 * @param {Array} configNames
 * @param {Object} [config] – Optional config to inherit, defaults to projectConfig
 * @returns {Object} – Convict configuration object
 */
var mergeConfigs = function(configPath, configNames, config) {
	var configsUsed = [];

	config = config || projectConfig;

	// work with the raw configuration object
	if (config && config.root) {
		config = config.root();
	}

	config = convict(config);
	configPath = path.resolve(appPath, configPath);
	configNames = configNames || [];

	configNames.forEach(function(configName) {
		var file;

		// Ignore local config in production mode
		if (configName == 'local' && nodeEnv === 'production') { return; }

		file = path.join(configPath, 'config-'+configName);
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

	// be informative
	!process.env.testRun
		&& configsUsed.push('env', 'args')
		&& console.log('configuration:', configsUsed.join(' < '));

	return config;
};


/**
 * Build some paths and create absolute paths from the cfg.sources using our base path
 */
var configurePaths = function configurePaths(cfg) {
	var sourcesBasePath = path.resolve(appPath, cfg.get('sourcesBasePath'))
	   ,sources = cfg.get('sources')
	   ,build = cfg.get('build')
	   ,buildBaseUri
	   ,buildDir = nodeEnv == 'development' ? build.baseDirNameDev : build.baseDirNameDist
	   ,buildPath = path.join( path.resolve(appPath, cfg.get('buildBasePath')), buildDir)
	   ,keys, key
	   ,i
	;

	buildBaseUri = cfg.get('staticBaseUri') + '/' + buildDir +'/';
	cfg.set('buildBaseUri', buildBaseUri);
	cfg.set('cssUri', buildBaseUri + build.css.dirName + build.css.external[nodeEnv]);
	cfg.set('jsUri', buildBaseUri + build.js.dirName + build.js.external[nodeEnv]);
	cfg.set('testUri', buildBaseUri + build.js.dirName + 'test.js');

	// Resolve absolute paths from relative paths in config files

	cfg.set('staticPath',            path.resolve(appPath, cfg.get('staticPath')));
	cfg.set('routesPath',            path.resolve(appPath, cfg.get('routesPath')));
	cfg.set('buildBasePath',         path.resolve(appPath, cfg.get('buildBasePath')));
	cfg.set('helpersPath',           path.resolve(appPath, cfg.get('helpersPath')));
	cfg.set('handlebarsHelpersPath', path.resolve(appPath, cfg.get('handlebarsHelpersPath')));

	cfg.set('repoWebViewBaseUri', cfg.get('repository').replace('.git', '/') );

	keys = Object.keys(sources);
	for (i = 0; i < keys.length; i++) {
		key = keys[i];
		cfg.set( 'sources.'+key, path.resolve( sourcesBasePath, sources[key]) );
	}

	build.css.inline[nodeEnv] &&
		cfg.set('build.css.inline',   path.resolve( buildPath, build.css.inline[nodeEnv] ));

	build.css.external[nodeEnv] &&
		cfg.set('build.css.external', path.resolve( buildPath, build.css.external[nodeEnv] ));

	build.js.inline[nodeEnv] &&
		cfg.set('build.js.inline',    path.resolve( buildPath, build.js.inline[nodeEnv] ));

	build.js.external[nodeEnv] &&
		cfg.set('build.js.external',  path.resolve( buildPath, build.js.external[nodeEnv] ));

	cfg.set('build.spritesheets', path.resolve( buildPath, build.spriteSheets.dirName ));

	return cfg;
};


function validate(config) {
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
}


// Create the project config.
projectConfig = mergeConfigs( projectConfigPath, projectConfigNames );
validate(projectConfig);
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
		merged = configurePaths(merged);
		validate(merged);
		return merged;
	}
	/**
	 * Get the project configuration, with get and set methods.
	 * @returns {Object} – project configuration
	 */
	,get: function() {
		return projectConfig;
	}
	/**
	 * Get the raw project configuration object
	 * @returns {Object} – project configuration
	 */
	,getRaw: function() {
		return projectConfig.root();
	}
};