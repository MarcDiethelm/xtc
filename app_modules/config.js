// Never commit authentication data to a public repository!
module.exports = {
	siteName: 'Hello World'
	,devPort: 3000
	,i18n: {
		lang: 'en-US'
	}
	,distFileNames: {
		js: {
			inline: {
				 development:       'inline.js'
				,production:        'inline.min.js'
			}
			,external: {
				 development:       'external.js'
				,production:        'external.min.js'
			}
		},
		css: {
			external: {
				 development:       'styles.css'
				,production:        'styles.min.css'
			}
		}
	}
	// use paths relative to app.js, they will be turned into absolute paths before use
	,paths: {
		//config: hardcoded in apps.js
		//helpers: hardcoded in apps.js
		 routes: 'app_modules/routes.js'
		//,inline: 'frontend/_inline'
		//,base: 'frontend/_terrific/_base'
		,module: 'frontend/_terrific/mod-{{name}}/'
		//,application: 'frontend/_terrific/_application'
		,dist: 'frontend/_static/dist/'
	},

	webPaths: {
		// where built assets are written
		dist: '/dist/'
	}
}