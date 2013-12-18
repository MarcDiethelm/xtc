// Never commit authentication data to a public repository!
module.exports = {
	// Default HTML title is constructed from this
	siteName: 'XTC Project'
	// Local port for the server
	,devPort: 3000
	,i18n: {
		// Sets the HTML lang attribute
		langDefault: 'en-US'
	}
	,allowAuthBypassForIpRanges: false
	,annotateModules: {
		development: true
		,production: false
	}
	,enableModuleTesting: true
	 // To construct links to views and modules
	,repository: 'https://github.com/MarcDiethelm/node-terrific/tree/develop/'
	// Should asset building include sprites generation? Dependencies: Glue (Python) and OptiPNG (binary executable)
	,enableSpritesBuilding: false

	// File system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// helpers: hardcoded in apps.js
		inline:             'frontend/_inline'
		,base:              'frontend/_base'
		,application:       'frontend/_application'
		,routes:            'controllers/routes.js'
		,views:             'frontend/views'
		,templates:         'frontend/views/templates'
		// Path to the Terrific modules directories
		,modulesBaseDir:    'frontend/modules'
		// Path to the static assets, used by Express and by the 'asset' template helper
		,staticBaseDir:     'frontend/_public'
	}
	// relative to templateBaseDir
	,defaultTemplateName:   'default'
	,moduleDirName:         '{{name}}'
	,skinsDirName:          'skins'

	// URIs for use in templates are constructed from the following data
		// URI prefix for static assets, e.g. '/static', empty string for none
	,'staticUriPrefix': ''
		// static assets URIs are relative to 'staticUriPrefix'
	,'static': {
		 img: 'img'
		// URIs to generated assets
		,build: {
			// baseDirName is relative to paths.staticBaseDir
			 baseDirNameDev     : 'build'
			,baseDirNameDist    : 'dist'
			// js and css are relative to baseDirName
			,js: {
				// to inline scripts in a template, usage: {{inline "js"}}
				inline: {
					 development:       'inline.js'
					,production:        'inline.min.js'
				}
				// URI of the generated main js file, usage: {{static.build.js.external}}
				,external: {
					 development:       'external.js'
					,production:        'external.min.js'
				}
			},
			css: {
				// to inline styles in a template, usage: {{inline "css"}}
				inline: {
					 development:       'inline.css'
					,production:        'inline.min.css'
				},
				// URI of the generated main css file, usage: {{static.build.css.external}}
				external: {
					 development:       'external.css'
					,production:        'external.min.css'
				}
			}
		}
	}

	 // Config properties for client-side QUnit
	,QUnitFE: {
		// QUnit updates document.title to add a checkmark or x-mark to indicate if a testsuite passed or failed.
		alterTitle: true
		// A summary of all executed tests is logged to the browser console.
		,consoleOutput: true
		// Activate the standard QUnit UI.
		,showUi: false
	}
}