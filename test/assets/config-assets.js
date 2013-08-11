module.exports = {
	enableSpritesBuilding: true

	// File system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// helpers: hardcoded in apps.js
		inline:             'test/assets/fixtures/_inline'
		,base:              'test/assets/fixtures/_base'
		,application:       'test/assets/fixtures/_application'
		//,routes:            'controllers/routes.js'
		//,views:             'frontend/views'
		//,templates:         'frontend/views/templates'
		// Path to the Terrific modules directories
		,modulesBaseDir:    'test/assets/fixtures/modules'
		// Path to the static assets, used by Express and by the 'asset' template helper
		,staticBaseDir:     'test/assets/expected/'
	}

	,'static': {
		 img: 'img'
		// URIs to generated assets
		,build: {
			// baseDirName is relative to paths.staticBaseDir
			baseDirName: '../build'
		}
	}
};