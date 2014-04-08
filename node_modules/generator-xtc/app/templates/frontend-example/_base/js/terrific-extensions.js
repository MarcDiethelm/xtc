/**
 * https://github.com/MarcDiethelm/terrificjs-extensions
 * Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.
 */

'use strict';

/**
 * Simplify connector channel subscription
 *
 * Because the second parameter to sandbox.subscribe() (this) often is forgotten.
 * Plus, connecting to multiple channels requires you to call subscribe for every channel.
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} channels - Connector channels to subscribe to
 */
Tc.Module.prototype.subscribe = function subscribe(channels) {
	var i = 0,
		args = arguments,
		argLen = args.length,
		channelName
	;

	for (i; i < argLen; i++) {
		channelName = channels[i];

		this.sandbox.subscribe(channelName, this);
	}
	return true;
};

/**
 * Select elements in the module context. Usage: this.$$(selector)
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @param {string} selector
 * @returns {object} – jQuery collection
 *
 */
Tc.Module.prototype.$$ = function $$(selector) {
	return this.$ctx.find(selector);
};

/**
 * Bind methods to Terrific module context.  Usage: this.bindAll(funcName [,funcName...])
 * @author Marc Diethelm <marc.diethelm@namics.com>
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} methods - Names of methods each as a param.
 * @return {boolean|undefined} - Returns true if binding succeeds, throws an exception otherwise.
 */
Tc.Module.prototype.bindAll = function bindAll(methods) {
	var i = 0,
		args = arguments,
		argLen = args.length,
		methodName
	;

	for (i; i < argLen; i++) {
		methodName = args[i];
		if (typeof this[methodName] === 'function') {
			this[methodName] = jQuery.proxy(this, methodName);
		}
		else {
			throw new TypeError('Tc.Module.' + this.getName() + '.' + methodName + ' is not a function');
		}
	}
	return true;
};

/**
 * Get the name of the Terrific module
 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
 * @author Mathias Hayoz <mathias.hayoz@namics.com>
 * @returns {string} – Module name
 */
Tc.Module.prototype.getName = function getName() {
	var property;
	if (!this._modName) {
		findMod: for (property in Tc.Module) {
			if (Tc.Module.hasOwnProperty(property) && property !== 'constructor' && this instanceof Tc.Module[property]) {
				this._modName = property;
				break findMod;
			}
		}
	}
	
	return this._modName;
};

/**
 * Simplify connector channel subscription
 *
 * Because the second parameter to sandbox.subscribe() (this) often is forgotten.
 * Plus, connecting to multiple channels requires you to call subscribe for every channel.
 * @author Simon Harte <simon.harte@namics.com>
 * @param {...string} channels - Connector channels to subscribe to
 */
Tc.Module.prototype.subscribe = function subscribe(channels) {
	var i = 0,
		args = arguments,
		argLen = args.length,
		channelName
	;

	for (i; i < argLen; i++) {
		channelName = channels[i];

		this.sandbox.subscribe(channelName, this);
	}
	return true;
};

(function () {
	var cache = {};
	/**
	 * Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data.
	 * This function is a remix of
	 * - Simple JavaScript Templating – John Resig - http://ejohn.org/ - MIT Licensed
	 * - https://gist.github.com/topliceanu/1537847
	 * - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
	 * This code incorporates a fix for single-quote usage.
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {string} str - Template
	 * @param {object} [data] – Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
	 * @returns {function|string} - Template function, to render template with data, or if data was supplied already the rendered template.
	 */
	Tc.Module.prototype.template = function template(str, data) {

		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			cache[str] = cache[str] ||
				template(document.getElementById(str).innerHTML) :
			// Generate a reusable function that will serve as a template
			// generator (and which will be cached).
			/*jshint -W054, -W014 */
			new Function("obj",
					"var p=[],print=function(){p.push.apply(p,arguments);};" +
					// Introduce the data as local variables using with(){}
					"with(obj){p.push('" +
					// Convert the template into pure JavaScript
					str.replace(/[\r\t\n]/g, " ")
						.replace(/'(?=[^%]*\}\}>)/g, "\t")
						.split("'").join("\\'")
						.split("\t").join("'")
						.replace(/\{\{=(.+?)\}\}/g, "',$1,'")
						.split("{{").join("');")
						.split("}}").join("p.push('")
					+ "');}return p.join('');");
		/*jshint +W054, +W014 */
		// Provide some basic currying to the user
		return data ? fn(data) : fn;
	};
})();
