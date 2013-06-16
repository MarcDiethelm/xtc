module.exports = function(app) { // to do: no need to export, no need to import app (so far)

	var hbs = require('hbs')
		,fs = require('fs')
		,path = require('path')
		,utils = require('./utils')
		,cache = {} // cache the modules sources
		,NODE_ENV = app.get('env')
		,annotateModules = app.config.annotateModules[NODE_ENV]
		,wrapperTemplate =
			'<{{tag}} class="mod mod-{{name}}{{#if htmlClasses}} {{htmlClasses}}{{/if}}{{#each skins}} skin-{{../name}}-{{this}}{{/each}}"{{#if id}} id="{{id}}"{{/if}}{{#if connectors}} data-connectors="{{connectors}}"{{/if}}>\n' +
			'   {{{moduleSrc}}}\n' +
			'</{{tag}}>\n'
		,defaults = {
			tag: 'div'
			,connectors: null
		}
		,renderModule
	;

	if (annotateModules) {
		 // descriptive comment, where to find the module
		wrapperTemplate =
			'<!-- START MODULE: {{_module}}, template: {{_file}}, path: {{_path}} -->\n' +
			wrapperTemplate +
			'<!-- END MODULE: {{_module}} -->\n\n'
	}

	wrapperTemplate = hbs.compile(wrapperTemplate);

	hbs.registerHelper('mod', function(name) {

		var  options
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
			,data           : hash.data ? (new Function('return' + hash.data))() : {}
		};

		return new hbs.SafeString( renderModule(options) );
	});


	renderModule = function renderModule(options) {
		var  cacheKey
			,modSourceTemplate
			,mergedData
		;

		options.template = options.template || options.name;
		options.tag = options.tag || defaults.tag;
		options.data = options.data || {};

		// merge the request context and data in the module include, with the latter trumping the former.

		mergedData = utils.extend(utils.clone(this), options.data);

		// create a unique identifier for the module/template combination

		cacheKey = options.name + ' ' + options.template;

		// force reading from disk in development mode

		NODE_ENV == 'development' && (cache[cacheKey] = null);

		// if the module/template combination is cached use it, else read from disk and cache it.
		modSourceTemplate = cache[cacheKey] || (cache[cacheKey] = getModTemplate(options));

		// render the module source in the locally merged context
		// moduleSrc is a {{variable}} in the moduleWrapper template

		options.moduleSrc = modSourceTemplate.fn(mergedData);

		// if we have a persisted read error, add the error class to the module.
		modSourceTemplate.err && (options.htmlClasses = options.htmlClasses ? options.htmlClasses + ' tc-error' : 'tc-error');

		if (annotateModules) {
			options._module = modSourceTemplate.name;
			options._file = modSourceTemplate.file;
			options._path = modSourceTemplate.path;
			options._git = modSourceTemplate.git;
		}

		// render the wrapper template
		return  wrapperTemplate(options);
	};


	function getModTemplate(options) {
		var moduleName = options.name
			,templateName = options.template
			,content
			,err
			,template = templateName == moduleName ? moduleName : moduleName + '-' + templateName
			,modDir = app.config.paths.module + app.config.moduleDirName.replace('{{name}}', moduleName)
			,file = path.join(modDir, template + '.hbs')
			,retVal
		;

		try {
			content = fs.readFileSync(file, 'utf8');
		} catch (e) {
			err = app.error('Can\'t read template file. Module: ' + moduleName + ', Template: ' + templateName + '.hbs.', e);
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
			retVal.path = modDir.replace(app.config.dirname, '');
			app.config.repository && (retVal.git = app.config.repository +'/tree/develop/'+ retVal.path);
		}
		return retVal;
	};

	return {
		renderModule: renderModule
	};

}