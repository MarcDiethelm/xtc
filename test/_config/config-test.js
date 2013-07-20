// Config for all tests, overrides defaults
module.exports = {
	devPort: 3333
	// file system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// path to the Terrific modules directories
		modulesBaseDir: 'test/fixtures/terrific-modules'
	}
	,moduleDirName:         'mod-{{name}}'
}
