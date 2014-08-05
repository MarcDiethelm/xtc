var  cfg = require('./configure').getRaw()
	,handlebars = require('handlebars')
	,fs = require('fs')
	,path = require('path')
	,_ = require('lodash-node')
	,utils = require('./utils')
	,cache = {} // cache the module template files in memory
	,NODE_ENV = process.env.NODE_ENV
	,annotateModules
	,wrapperTemplate =
		'<{{tag}} class="mod mod-{{name}}{{#if classes}} {{classes}}{{/if}}{{#each skins}} skin-{{../name}}-{{this}}{{/each}}"{{#if id}} id="{{id}}"{{/if}}{{#each attributes}} {{this.key}}="{{{this.value}}}"{{/each}}>' +
		'{{{moduleSrc}}}\n' +
		'</{{tag}}>'
	,wrapped = ''
	,wrapperFn
	,defaults = {
		tag: 'section'
	}
;


/**
 *
 * @param {object} [customCfg] – Optional xtc configuration, used for testing with specific configs.
 * @returns {Function}
 */
module.exports = function(customCfg) {
	// usually just get() the cached config. but framework tests can pass a different config.
	cfg = customCfg || cfg;
	annotateModules = cfg.annotateModules[NODE_ENV];

	if (annotateModules) {
		// descriptive comment, where to find the module
		wrapped =
			'<!-- START MODULE: {{_module}}, template: {{_file}}, path: {{_path}}{{# if _repository}}, repository: {{_repository}}{{/if}} -->\n' +
			wrapperTemplate +
			'\n<!-- END MODULE: {{_module}} -->'
		;
	}
	else {
		wrapped = wrapperTemplate;
	}
	wrapperFn = handlebars.compile(wrapped);

	return renderModule;
}


/**
 * Render a Terrific markup module
 * @param {Object} context
 * @param {{name: String}} options
 * @returns {String} – Module HTML
 */
function renderModule(context, options) {
	var  cacheKey
		,modSourceTemplate
		,mergedData
		,html
		,err
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
	options.data.moduleNestingLevel = typeof context.moduleNestingLevel === 'undefined' ? 0 : context.moduleNestingLevel + 1;
	autoIncrementIndent = options.data.moduleNestingLevel > 0 ? 1 : false;
	options.data.indent = options.indent || autoIncrementIndent || context.indent || 0;

	// merge the request context and data in the module include, with the latter trumping the former.
	mergedData = _.merge({}, context, options.data);

	// create a unique identifier for the module/template combination
	cacheKey = options.name + ' ' + options.template;

	// If addTest exists it means we should pass module options into it for later client-side module testing.
	context._locals && context._locals.addTest && context._locals.addTest(options);

	// force reading from disk in development mode
	NODE_ENV == 'development' && (cache[cacheKey] = null);

	// if the module/template combination is cached use it, else read from disk and cache it.
	modSourceTemplate = cache[cacheKey] || (cache[cacheKey] = getModTemplate(options));

	// render the module source in the locally merged context
	// moduleSrc is a {{variable}} in the moduleWrapper template
	try {
		options.moduleSrc = modSourceTemplate.fn(mergedData);
	}
	catch (e) {
		if (process.env.NODE_ENV != 'test') {
			if (e instanceof RenderError)   // if this is our error from a nested template rethrow it.
				throw e;
			else                            // if this is the original Handlebars error, make it useful
				throw new RenderError('Module: ' + options.name + ', Template: ' + options.template + cfg.templateExtension +'\n'+ e.toString().replace(/^Error/, 'Reason'));
		}
	}


	if (options.noWrapper) {
		html = options.moduleSrc;
	}
	else {
		// if we have a persisted read error, add the error class to the module.
		modSourceTemplate.err && (options.classes = options.classes ? options.classes + ' xtc-error' : 'xtc-error');

		if (annotateModules) {
			options._module = modSourceTemplate.name;
			options._file = modSourceTemplate.file;
			options._path = modSourceTemplate.path;
			options._repository = modSourceTemplate.repository;
		}

		// render the wrapper template
		html = wrapperFn(options);
	}

	// manage indentation
	if (mergedData.indent) {
		try {
			html = utils.indent(html, mergedData.indent, cfg.indentString);
		}
		catch (e) {
			err = utils.error('Indent error, Module: '+ options.name, e);
			console.error(err.c);
			options.classes = options.classes ? options.classes + ' xtc-error' : 'xtc-error';
			options.moduleSrc = err.web;
			html = wrapperFn(options);
		}
	}

	return html;
}


/**
 *
 * @param options
 * @returns {{fn: *, err: *}}
 */
function getModTemplate(options) {
	var  moduleName = options.name
		,templateName = options.template
		,content
		,err
		,template = templateName == moduleName ? moduleName : moduleName + '-' + templateName
		,modDirName = cfg.moduleDirName.replace('{{name}}', moduleName)
		,modDir = path.join( cfg.sources.modulesBaseDir, modDirName)
		,fileName = template + cfg.templateExtension
		,file = path.join(modDir, fileName)
		,retVal
	;

	try {
		content = fs.readFileSync(file, 'utf8');
	}
	catch (e) {
		err = utils.error('Can\'t read template file. Module: ' + moduleName + ', Template: ' + fileName, e);
		!process.env.testRun && console.error(err.c);
		options.error = true;
	}
	
	// indent module content one level
	// this is a bit crude: we assume that 'noWrapper' modules will always be used without wrapper and let renderModule cache them without indentation
	// Maybe cache management should be moved to this function...
	if (content && !options.noWrapper) {
		content = utils.indent(content, 1, cfg.indentString);
	}
	retVal = {
		 // if there was an error use the error as module content, else precompile content (can be empty string).
		 fn: handlebars.compile(err ? err.web : content)
		,err: err
	};

	if (annotateModules) {
		retVal.name = moduleName;
		retVal.file = fileName;
		retVal.path = path.relative(cfg.appPath, modDir);
		retVal.repository = utils.getRepoWebViewUri(cfg.repoWebViewBaseUri, cfg.repositoryBranch, modDir, fileName);
	}
	return retVal;
}


// Create an error constructor, that prototypally inherits from the Error constructor.
// We're not enabling a stacktrace on purpose.
function RenderError(message) {
	this.message = message;
	this.name = 'RenderError';
}
RenderError.prototype.__proto__ = Error.prototype;