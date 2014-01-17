// Never commit authentication data to a public repository!

var check = require('../lib/validator');

module.exports = {

	// Default html > head > title is constructed from this
	 siteName: 'XTC Project'
	,devPort: {
		doc: 'Local port for the server'
		,format: 'port'
		,default: 3000
	}
	,i18n: {
		// Sets the HTML lang attribute
		langDefault: 'en-US'
	}
	// Basic auth credentials to protect routes
	,auth: {
		basic: {
			format      : Object
			,default    : {}
			,env        : 'AUTH_BASIC'
		},

		/*
		 Don't require authentication for these IPs
		 this property is used a the second arguments to range_check.in_range
		 see: https://npmjs.org/package/range_check
		 for the range notation: use http://ip2cidr.com/
		 or see e.g. http://compnetworking.about.com/od/workingwithipaddresses/a/cidr_notation.htm
		 /32: exact ip
		 */
		ip: {
			format: function(val) {
				check('ipRanges', val, 'should contain valid IP ranges');
			}
			,default: [
				// localhost
				'127.0.0.1/32'
			]
			,'env'      : 'AUTH_IP'
		}
	}
	,allowAuthBypassForIpRanges: false
	,annotateModules: {
		development: true
		,production: false
	}
	,enableModuleTesting: true
	,repository: {
		 doc        : 'Used to construct links to views, modules and layouts in the project overview'
		,format     : 'url'
		,default    : 'https://github.com/MarcDiethelm/node-terrific/tree/develop/'
	}
	// Should asset building include sprites generation? Dependencies: Glue (Python) and OptiPNG (binary executable)
	,enableSpritesBuilding: false

	// File system paths relative to app.js, a property called app.config.pathsAbsolute will be generated from them
	,paths: {
		// helpers: hardcoded in apps.js
		inline              : 'frontend/_inline'
		,base               : 'frontend/_base'
		,application        : 'frontend/_application'
		,routes             : 'controllers/routes.js'
		,views              : 'frontend/views'
		,layouts            : 'frontend/views/layouts'
		// Path to the Terrific modules directories
		,modulesBaseDir     : 'frontend/modules'
		// Path to the static assets, used by Express and by the 'asset' template helper
		,staticBaseDir      : 'frontend/_public'
	}
	// relative to templateBaseDir
	,defaultLayoutName      : 'default'
	,moduleDirName          : '{{name}}'
	,skinsDirName           : 'skins'

	// URIs for use in layouts are constructed from the following data
		// URI prefix for static assets, e.g. '/static', empty string for none
	,staticUriPrefix: ''
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
					 development    : 'inline.js'
					,production     : 'inline.min.js'
				}
				// URI of the generated main js file, usage: {{static.build.js.external}}
				,external: {
					 development    : 'external.js'
					,production     : 'external.min.js'
				}
			},
			css: {
				// to inline styles in a template, usage: {{inline "css"}}
				inline: {
					 development    : 'inline.css'
					,production     : 'inline.min.css'
				},
				// URI of the generated main css file, usage: {{static.build.css.external}}
				external: {
					 development    : 'external.css'
					,production     : 'external.min.css'
				}
			}
		}
	}

	// Characters to use for indentation of modules and inline assets
	,indentString: '\t'
	// default indentation level of modules and inline assets
	// (currently 0, because views rendered with Handlebars can't be indented)
	,indentLevel: 0

	 // Config properties for client-side QUnit
	,QUnitFE: {
		// QUnit updates document.title to add a checkmark or x-mark to indicate if a testsuite passed or failed.
		alterTitle      : true
		// A summary of all executed tests is logged to the browser console.
		,consoleOutput  : true
		// Activate the standard QUnit UI.
		,showUi         : false
	}
}