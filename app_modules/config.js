// Don't commit this file to your repository
module.exports = {
	siteName: 'Hello World'
	,devPort: 3000
	,i18n: {
		lang: 'en-US'
	}
	// use paths relative to app.js, they will be turned into absolute paths before use
	,paths: {
		//config: hardcoded in apps.js
		//helpers: hardcoded in apps.js
		 routes: 'app_modules/routes.js'
		//,inline: 'frontend/_inline'
		//,base: 'frontend/_terrific/_base'
		,module: 'frontend/_terrific/mod-{{name}}'
		//,application: 'frontend/_terrific/_application'
	}
}