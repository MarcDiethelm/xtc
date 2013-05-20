module.exports = function(app) { // to do: no need to export, no need to import app (so far)

	var hbs = require('hbs')
		,fs = require('fs')
		,path = require('path')
		,mods = {} // cache the modules sources
		,wrapperTemplate = '<{{tag}} class="mod mod-{{name}}{{#if htmlClasses}} {{htmlClasses}}{{/if}}{{#each skins}} skin-{{../name}}-{{this}}{{/each}}"{{#if connectors}} data-connectors="{{connectors}}"{{/if}}>{{{moduleSrc}}}</{{tag}}>'
		,defaults = {
			tag: 'div'
			,connectors: null
		}
		,NODE_ENV = app.get('env')
	;

	wrapperTemplate = hbs.compile(wrapperTemplate)

	hbs.registerHelper('mod', function(name) {
		var  options
			,argLen = arguments.length
			,hash = arguments[argLen-1].hash
			,args = {}
			,cacheKey
			,wrappedMod
			,modSourceTemplate
		;
		argLen >= 2 && (args.name = arguments[0]);

		options = {
			name            : args.name || hash.name || undefined
			,tag            : hash.tag || defaults.tag
			,htmlClasses    : hash.htmlClasses || undefined
			,skins          : hash.skins && hash.skins.replace(' ', '').split(',') || undefined
			,connectors     : hash.connectors || undefined
		}

		options.template = hash.template || options.name;
		cacheKey = options.name + ' ' + options.template;

		// force reading from disk in development mode

		NODE_ENV == 'development' && (cache[cacheKey] = null);

		// if the module/template combination is cached use it, else read from disk and cache it.
		modSourceTemplate = mods[cacheKey] || (mods[cacheKey] = getModTemplate(options));
		// render the module source in the request context, so that variables can be interpolated based on request controller data
		options.moduleSrc = modSourceTemplate(this); // moduleSrc is a var in the moduleWrapper template

		// if there was an error while reading the module template, persist it
		options.error && (mods[cacheKey].error = true);
		// if we have a persisted read error, add the error class to the module.
		mods[cacheKey].error && (options.htmlClasses = options.htmlClasses ? options.htmlClasses + ' tc-error' : 'tc-error');

		// render the wrapper template
		wrappedMod = wrapperTemplate(options);

		return new hbs.SafeString(wrappedMod);
	});

	function getModTemplate(options) {
		var moduleName = options.name
			,templateName = options.template
			,content
			,err
			,template = templateName == moduleName ? moduleName : moduleName + '-' + templateName
			,modDir = app.config.paths.module.replace('{{name}}', moduleName)
			,file = path.join(modDir, template + '.hbs')
		;

		try {
			//console.log('read module', file)
			content = fs.readFileSync(file, 'utf8');
		} catch (e) {
			err = app.error('Can\'t read template file. Module: ' + moduleName + ', Template: ' + templateName + '.hbs.', e);
			console.error(err.c);
			options.error = true;
		}
		return hbs.compile(content || err.web);
	}
}