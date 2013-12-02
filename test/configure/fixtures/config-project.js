// Never commit authentication data to a public repository!
module.exports = {
	devPort: 3333
		// static assets URIs are relative to 'staticUriPrefix'
		// file system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// path to the static assets, used by Express and by the 'asset' template helper,
		staticBaseDir: 'frontend/_static/'
	}
}