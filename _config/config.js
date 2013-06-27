// Never commit authentication data to a public repository!
module.exports = {
	siteName: 'Hello World'
	,devPort: 3000
	,i18n: {
		langDefault: 'en-US'
	}
	,annotateModules: {
		development: true
		,production: false
	}
	 // to construct links to views and modules
	,repository: 'https://github.com/MarcDiethelm/node-terrific/tree/develop/'
	// paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		//config: hardcoded in apps.js
		//helpers: hardcoded in apps.js
		 routes: 'app_modules/routes.js'
		//,inline: 'frontend/_inline'
		//,base: 'frontend/_terrific/_base'
		// path to the view and templates directories
		,templateBaseDir: 'frontend/'
		// path to the Terrific modules directories
		,modulesBaseDir: 'frontend/_terrific/'
		//,application: 'frontend/_terrific/_application'
		,dist: 'frontend/_static/dist/'
	}
	// relative to templateBaseDir
	,viewsDirName: 'views/'
	,templatesDirName: 'templates/'
	,defaultTemplateName: 'default'
	,moduleDirName: 'mod-{{name}}/'
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

	,webPaths: {
		// where built assets are written
		dist: '/dist/'
		,img: '/img/'
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