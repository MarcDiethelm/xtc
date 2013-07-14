module.exports = function(cfg) {

	var hbs = require('hbs')
		,fs = require('fs')
		,path = require('path')
		,utils = require('./utils')
		,cache = {} // cache the modules sources
		,NODE_ENV = process.env.NODE_ENV
		,annotateModules
		,wrapperTemplate =
			'<{{tag}} class="mod mod-{{name}}{{#if htmlClasses}} {{htmlClasses}}{{/if}}{{#each skins}} skin-{{../name}}-{{this}}{{/each}}"{{#if id}} id="{{id}}"{{/if}}{{#if connectors}} data-connectors="{{connectors}}"{{/if}}>\n' +
			'\t{{{moduleSrc}}}\n' +
			'</{{tag}}>\n'
		,defaults = {
			tag: 'section'
			,connectors: null
		}
		,renderModule
	;

	if (NODE_ENV == 'test') {
		NODE_ENV = 'development';
	}

	annotateModules = cfg.annotateModules[NODE_ENV]

	if (annotateModules) {
		 // descriptive comment, where to find the module
		wrapperTemplate =
			'<!-- START MODULE: {{_module}}, template: {{_file}}, path: {{_path}}, repository: {{_repository}} -->\n' +
			wrapperTemplate +
			'<!-- END MODULE: {{_module}} -->\n\n'
		;
	}

	wrapperTemplate = hbs.compile(wrapperTemplate);


	hbs.registerHelper('mod', function(name) {

		var  options
			// the last argument always is a hash of key/value parameters passed into the helper
			,argLen = arguments.length
			,hash = arguments[argLen-1].hash
			,args = {}
		;
		argLen >= 2 && (args.name = arguments[0]);

		options = {
			 name           : args.name || hash.name
			,template       : hash.template
			,tag            : hash.tag
			,id             : hash.id
			,htmlClasses    : hash.htmlClasses
			,skins          : hash.skins && hash.skins.replace(' ', '').split(',') || undefined
			,connectors     : hash.connectors
			,_isLayout      : hash._isLayout
			,noWrapper      : hash.noWrapper
			,data           : hash.data ? (new Function('return' + hash.data))() : {}
		};

		return new hbs.SafeString( renderModule(this, options) );
	});


	renderModule = function renderModule(context, options) {
		var  cacheKey
			,modSourceTemplate
			,mergedData
		;

		// this check is used when rendering isolated modules or views for development and testing (in the default layout!).
		// skip any modules that are not THE module or THE view.
		// view: skip all modules that have the attribute _isLayout="true"
		// module: skip all other modules
		if (
				context.skipModules === true ||                         // case: module
				context.skipModules == 'layout' && options._isLayout    // case: view
			)
		{ return ''; }

		options.template = options.template || options.name;
		options.tag = options.tag || defaults.tag;
		options.data = options.data || {};

		// merge the request context and data in the module include, with the latter trumping the former.

		mergedData = utils.deepExtend(context, options.data);

		// create a unique identifier for the module/template combination

		cacheKey = options.name + ' ' + options.template;

		// force reading from disk in development mode

		NODE_ENV == 'development' && (cache[cacheKey] = null);

		// if the module/template combination is cached use it, else read from disk and cache it.
		modSourceTemplate = cache[cacheKey] || (cache[cacheKey] = getModTemplate(options));

		// render the module source in the locally merged context
		// moduleSrc is a {{variable}} in the moduleWrapper template

		options.moduleSrc = modSourceTemplate.fn(mergedData);

		// if noWrapper is requested we're done here
		if (options.noWrapper) return options.moduleSrc;

		// if we have a persisted read error, add the error class to the module.
		modSourceTemplate.err && (options.htmlClasses = options.htmlClasses ? options.htmlClasses + ' tc-error' : 'tc-error');

		if (annotateModules) {
			options._module = modSourceTemplate.name;
			options._file = modSourceTemplate.file;
			options._path = modSourceTemplate.path;
			options._repository = modSourceTemplate.repository;
		}

		// render the wrapper template
		return wrapperTemplate(options);
	};


	function getModTemplate(options) {
		var moduleName = options.name
			,templateName = options.template
			,content
			,err
			,template = templateName == moduleName ? moduleName : moduleName + '-' + templateName
			,modDirName = cfg.moduleDirName.replace('{{name}}', moduleName)
			,modDir = path.join( cfg.paths.modulesBaseDir, modDirName)
			,file = path.join(modDir, template + '.hbs')
			,retVal
		;

		try {
			content = fs.readFileSync(file, 'utf8');
		} catch (e) {
			err = utils.error('Can\'t read template file. Module: ' + moduleName + ', Template: ' + templateName + '.hbs.', e);
			console.error(err.c);
			options.error = true;
		}

		retVal = {
			fn: hbs.compile(content || err.web)
			,err: err
		};

		if (annotateModules) {
			retVal.name = moduleName;
			retVal.file = template + '.hbs';
			retVal.path = modDir.replace(cfg.dirname, '');
			cfg.repository && (retVal.repository = cfg.repository + retVal.path);
		}
		return retVal;
	};

	return {
		renderModule: renderModule
	};

}