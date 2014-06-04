// Never commit authentication data to a public repository!

/**
 * Default configuration
 *
 * Uses convict.js. Properties can be simple values like strings, integers, etc or "schemas"
 * see: https://github.com/mozilla/node-convict
 *
 * @type {exports}
 */

// Resolve the path to the validation module, via xtc's lib/configure.js
var path = require('path')
   ,check = require(path.join(module.parent.filename.split(path.sep +'lib')[0], 'lib/validator'))
;

module.exports = {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// App basics

	// Default html > head > title is constructed from this
	 "siteName": "XTC Project"

	,"devPort": {
		 doc            : 'Local port for the server'
		,format         : 'port'
		,default        : 3000
		,env            : 'PORT' // Heroku-style deployments require a specific env var for port: "PORT"
		,arg            : 'port'
	}

	,"i18n": {
		// Sets the HTML lang attribute
		"langDefault"   : "en-US"
	}

	,"enableModuleTesting": true

	// Should asset building include sprites generation? Dependencies: Glue (Python) and OptiPNG (binary executable)
	,"enableSpritesBuilding": false

	,"repository": {
		 doc            : 'To construct links to views, modules and layouts in your repository\'s web UI ("read-only" https .git URI)'
		,format         : function(val) { check('gitUri', val, 'Should be a https git URI') }
		,default        : 'https://github.com/MarcDiethelm/xtc.git'
	}
	,"repositoryBranch" : {
		 doc            : 'To construct links to views, modules and layouts in your repository\'s web UI'
		,format         : String
		,default        : 'develop'
		,env            : 'REPO_BRANCH'
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Rendering

	,"annotateModules": {
		 "development"  : true
		,"production"   : false
	}

	// Characters to use for indentation of modules and inline assets
	,"indentString"     : '\t'
	// default indentation level of modules and inline assets
	// (currently 0, because views rendered with Handlebars can't be indented)
	,"indentLevel"      : 0


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Basic auth credentials to protect routes

	,"auth": {
		"basic": {
			 format     : Object
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
		"ip": {
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

	,"allowAuthBypassForIpRanges": false


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Frontend sources
	// Paths to frontend source folders relative to process start dir, will be resolved to absolute paths

	// base path to the frontend sources, can be empty
	,"sourcesBasePath"  : "frontend/"
	,"sources": {
		"inline"            : "inline"
		,"base"             : "base"
		,"application"      : "application"
		,"views"            : "_views"
		,"layouts"          : "_views/layouts"
		// Path to the Terrific modules directories
		,"modulesBaseDir"   : "modules"
	}
	,"customModuleTemplatePath" : "" // Path to a file or directory to process when generating modules. If falsy xtc default module is used.
	,"templateExtension"    : ".hbs"
	,"defaultLayoutName"    : "default"
	,"moduleDirName"        : "{{name}}" // A pattern for module folder names, {{name}} will be replaced.
	,"skinsDirName"         : "skins"


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Frontend asset build destinations
	// Destination paths and file names. Paths relative to process start dir, will be resolved to absolute paths.

	,"buildBasePath"    : "frontend/public"
	,"build": {
		// baseDirNameX is relative to buildBasePath
		"baseDirNameDev"    : "build", // Include this dir in .gitignore
		"baseDirNameDist"   : "dist"

		// js and css are relative to baseDirNameX
		,"js": {
			"dirName"           : ""
			// to inline scripts in a template, usage: {{inline "js"}}
			,"inline": {
				 "development"      : "inline.js"
				,"production"       : "inline.min.js"
			}
			// URI and file name of the generated main js file, usage: {{static.build.js.external}}
			,
			"external": {
				 "development"      : "external.js"
				,"production"       : "external.min.js"
			}
		},
		"css": {
			"dirName"           : ""
			// to inline styles in a template, usage: {{inline "css"}}
			,"inline": {
				 "development"      : "inline.css"
				,"production"       : "inline.min.css"
			},
			// URI and file name of the generated main css file, usage: {{static.build.css.external}}
			"external": {
				 "development"      : "external.css"
				,"production"       : "external.min.css"
			}
		}
		,"spriteSheets": {
			"dirName"           : ""
		}
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Routing

	,"routesPath"           : "controllers/routes.js"

	// URIs for use in layouts are constructed from the following data

	// URI prefix for static assets, e.g. '/static', empty string for none
	, "staticBaseUri"       : ""

	// Physical path to the static assets, used by Express and by the 'asset' template helper
	,"staticPath"           : "frontend/public"

	// list static asset sub-paths to create direct references for, for use in templates. Relative to staticPath
	, "static": {
		"img"               : "img"
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Helpers

	,"helpersPath": {
		default     : 'lib/helpers.js'
		,env        : 'HELPERS_PATH'
		,format     : String
	}
	,"handlebarsHelpersPath" : "lib/handlebars-helpers.js"


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Module Testing

	 // Config properties for client-side QUnit
	,"QUnitFE": {
		// QUnit updates document.title to add a checkmark or x-mark to indicate if a testsuite passed or failed.
		"alterTitle"        : true
		// A summary of all executed tests is logged to the browser console.
		,"consoleOutput"    : true
		// Activate the standard QUnit UI.
		,"showUi"           : false
	}
}