module.exports = {
	enableSpritesBuilding: true

	// File system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// helpers: hardcoded in apps.js
		inline:             'test/assets/fixtures/uri/_inline'
		,base:              'test/assets/fixtures/uri/_base'
		,application:       'test/assets/fixtures/uri/_application'
		//,views:             'frontend/views'
		//,templates:         'frontend/views/templates'
		// Path to the Terrific modules directories
		,modulesBaseDir:    'test/assets/fixtures/uri/modules'
		// Path to the static assets, used by Express and by the 'asset' template helper
		,staticBaseDir:     'test/assets/expected/'
	}

	// URI prefix for static assets, e.g. '/static', empty string for none
	,'staticUriPrefix': '/static'
	,'static': {
		// URIs to generated assets
		build: {
			// baseDirName is relative to paths.staticBaseDir
			baseDirName: '../build'
		}
	}
};