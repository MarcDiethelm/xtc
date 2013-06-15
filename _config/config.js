// Never commit authentication data to a public repository!
module.exports = {
	siteName: 'Hello World'
	,devPort: 3000
	,i18n: {
		langDefault: 'en-US'
	}
	,annotateModules: {
		development: true
		,production: true
	}
	,defaultTemplate: 'templates/default'
	,assets: {
		js: { // set and use this property name to include an inline file in a template, e.g. {{asset "js"}}
			inline: {
				 development:       'inline.js'
				,production:        'inline.min.js'
			}
			,external: {
				 development:       'external.js'
				,production:        'external.min.js'
			}
		},
		css: { // set and use this property name to include an inline file in a template, e.g. {{asset "css"}}
			inline: {
				 development:       'inline.css'
				,production:        'inline.min.css'
			},
			external: {
				 development:       'external.css'
				,production:        'external.min.css'
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
		,views: 'frontend/views/'
		//,application: 'frontend/_terrific/_application'
		,dist: 'frontend/_static/dist/'
	}

	,webPaths: {
		// where built assets are written
		dist: '/dist/'
	}

	 // Config properties for client-side QUnit
	,QUnitFE: {
		// QUnit updates document.title to add a checkmark or x-mark to indicate if a testsuite passed or failed.
		alterTitle: true
		// A summary of all executed tests and any failed tests are logged to the browser console.
		// In addition you can activate the standard QUnit UI.
		,showUi: false
	}
}