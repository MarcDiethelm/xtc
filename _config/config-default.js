// Never commit authentication data to a public repository!

/**
 * Default configuration
 *
 * Uses convict.js. Properties can be simple values like strings, integers, etc or "schemas"
 * see: https://github.com/mozilla/node-convict
 *
 * @type {exports}
 */

var check = require('../lib/validator');

module.exports = {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// App basics

	// Default html > head > title is constructed from this
	 "siteName": "XTC Project"

	,"devPort": {
		 doc            : 'Local port for the server'
		,format         : 'port'
		,default        : 3000
	}

	,"i18n": {
		// Sets the HTML lang attribute
		"langDefault"   : "en-US"
	}

	,"enableModuleTesting": true

	// Should asset building include sprites generation? Dependencies: Glue (Python) and OptiPNG (binary executable)
	,"enableSpritesBuilding": false

	,"repository": {
		 doc            : 'Used to construct links to views, modules and layouts in the project overview'
		,format         : 'url'
		,default        : 'https://github.com/MarcDiethelm/xtc/tree/develop/'
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
	// Paths to frontend source folders relative to app.js, will be resolved to absolute paths

	// base path to the frontend sources, can be empty
	,"sourcesBasePath"  : "frontend"
	,"sources": {
		"inline"            : "_inline"
		,"base"             : "_base"
		,"application"      : "_application"
		,"views"            : "views"
		,"layouts"          : "views/layouts"
		// Path to the Terrific modules directories
		,"modulesBaseDir"   : "modules"
	}
	,"templateExtension"    : ".hbs"
	,"defaultLayoutName"    : "default"
	,"moduleDirName"        : "{{name}}" // A pattern for module folder names, {{name}} will be replaced.
	,"skinsDirName"         : "skins"


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Frontend asset build destinations
	// Destination paths and file names. Paths relative to app.js, will be resolved to absolute paths.

	,"buildBasePath"    : "frontend/_public"
	,"build": {
		// baseDirNameX is relative to buildBasePath
		"baseDirNameDev"    : "build",
		"baseDirNameDist"   : "dist"

		// js and css are relative to baseDirNameX
		,"js": {
			"dirName"           : ""
			// to inline scripts in a template, usage: {{inline "js"}}
			,"inline": {
				 "development"      : "inline.js"
				,"production"       : "inline.min.js"
			}
			// URI of the generated main js file, usage: {{static.build.js.external}}
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
			// URI of the generated main css file, usage: {{static.build.css.external}}
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
	,"staticPath"           : "frontend/_public"

	// list static asset sub-paths to create direct references for, for use in templates. Relative to staticPath
	, "static": {
		"img"               : "img"
	}


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