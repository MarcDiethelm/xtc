// Never commit authentication data to a public repository!
module.exports = {
	siteName: 'XTC Project'
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

	// file system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		//helpers: hardcoded in apps.js
		//,inline: 'frontend/_inline'
		//,base: 'frontend/_terrific/_base'
		//,application: 'frontend/_terrific/_application'
		 routes: 'controllers/routes.js'
		// path to the view and templates directories
		,templateBaseDir: 'frontend/'
		// path to the Terrific modules directories
		,modulesBaseDir: 'frontend/_terrific/'
		// path to the static assets, used by Express and by the 'asset' template helper
		,staticBaseDir: 'frontend/_static/'
	}
	// relative to templateBaseDir
	,viewsDirName: 'views/'
	,templatesDirName: 'templates/'
	,defaultTemplateName: 'default'
	,moduleDirName: 'mod-{{name}}/'

	// URIs for use in templates are constructed from the following data
		// URI prefix for static assets, e.g. '/static'
	,'staticUriPrefix': ''
		// static assets URIs are relative to 'staticUriPrefix'
	,'static': {
		 img: '/img'
		// URIs to generated assets
		,build: {
			js: {
				// to inline scripts in a template, usage: {{inline "js"}}
				inline: {
					 development:       '/dist/inline.js'
					,production:        '/dist/inline.min.js'
				}
				// URI of the generated main js file, usage: {{static.build.js.external}}
				,external: {
					 development:       '/dist/external.js'
					,production:        '/dist/external.min.js'
				}
			},
			css: {
				// to inline styles in a template, usage: {{inline "css"}}
				inline: {
					 development:       '/dist/inline.css'
					,production:        '/dist/inline.min.css'
				},
				// URI of the generated main css file, usage: {{static.build.css.external}}
				external: {
					 development:       '/dist/external.css'
					,production:        '/dist/external.min.css'
				}
			}
		}
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