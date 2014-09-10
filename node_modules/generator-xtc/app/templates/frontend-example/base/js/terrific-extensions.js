/**
 * https://github.com/MarcDiethelm/terrificjs-extensions
 * Adds some sugar and enhancements to @brunschgi's excellent Terrificjs frontend framework.
 * @file terrificjs-extensions.js
 * @license MIT
 * @copyright 2014 Marc Diethelm
 */

(function ($) {

	'use strict';


	/**
	 * Select elements in the module context. Usage: this.$(selector)
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
	Tc.Module.prototype.$ = function $$(selector) {
		return this.$ctx.find(selector);
	};


	/**
	 * Deprecated. Use Tc.Module.prototype.$
	 * Select elements in the module context. Usage: this.$$(selector)
	 * @deprecated Use Tc.Module.prototype.$
	 * @see Tc.Module.prototype.$
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} selector
	 * @returns {Object} - jQuery collection
	 */
	Tc.Module.prototype.$$ = Tc.Module.prototype.$;

	/**
	 * Bind methods to Terrific module context. Usage: this.bindAll(funcName [,funcName...])
	 * Inspired by Underscore's bindAll. http://underscorejs.org/#bindAll
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} methods - Names of methods each as a param.
	 * @returns {Module} - Returns the module instance for chaining.
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
				this[methodName] = $.proxy(this, methodName);
			} else if (typeof methodName === 'string') {
				throw new TypeError('bindAll: Tc.Module.' + this.getName() + '.' + methodName + ' is not a function');
			} else {
				throw new TypeError('Arguments to bindAll must be strings');
			}
		}

		return this;
	};

	/**
	 * Get the name of the Terrific module
	 * @author Remo Brunschwiler <remo.brunschwiler@namics.com>
	 * @author Mathias Hayoz <mathias.hayoz@namics.com>
	 * @returns {String} - Module name
	 */
	Tc.Module.prototype.getName = function getName() {
		var property;
		if (!this._modName) {
			for (property in Tc.Module) {
				if (Tc.Module.hasOwnProperty(property) && property !== 'constructor' && this instanceof Tc.Module[property]) {
					this._modName = property;
					break;
				}
			}
		}

		return this._modName;
	};

	/**
	 * Simplify connector channel subscription. Usage: this.subscribe(channelName [,channelName...])
	 *
	 * Because the second parameter to sandbox.subscribe (this) is often forgotten.
	 * Additionally this method allows connecting to multiple channels at once.
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} channels - Connector channels to subscribe to
	 * @returns {Module} - Returns the module instance for chaining
	 */
	Tc.Module.prototype.subscribe = function subscribe(channels) {
		var i = 0,
			args = arguments,
			argLen = args.length,
			channelName
			;

		for (i; i < argLen; i++) {
			channelName = args[i];
			this.sandbox.subscribe(channelName, this);
		}

		return this;
	};

	/**
	 * Simplify unsubscribe of connector channel. Usage: this.unsubscribe(channelName [,channelName...])
	 *
	 * @author Simon Harte <simon.harte@namics.com>
	 * @param {...String} channels - Connector channels to subscribe to
	 * @returns {Module} - Returns the module instance for chaining
	 */
	Tc.Module.prototype.unsubscribe = function unsubscribe(channels) {
		var i = 0,
			args = arguments,
			argLen = args.length,
			channelName
			;

		for (i; i < argLen; i++) {
			channelName = args[i];
			this.sandbox.unsubscribe(channelName, this);
		}

		return this;
	};

	var tplCache = {};
	/**
	 * Micro-templating for modules. Extrapolates {{= foo }} variables in strings from data.
	 * This function is a remix of
	 * - Simple JavaScript Templating – John Resig - http://ejohn.org/ - MIT Licensed
	 * - https://gist.github.com/topliceanu/1537847
	 * - http://weblog.west-wind.com/posts/2008/Oct/13/Client-Templating-with-jQuery
	 * This code incorporates a fix for single-quote usage.
	 * @author Marc Diethelm <marc.diethelm@namics.com>
	 * @param {String} str - Template
	 * @param {Object} [data] - Optional, renders template immediately if present. Data to use as the template context for variable extrapolation.
	 * @returns {Function|String} - Template function, to render template with data, or if data was supplied already the rendered template.
	 */
	Tc.Module.prototype.template = function template(str, data) {

		// Figure out if we're getting a template, or if we need to
		// load the template - and be sure to cache the result.
		var fn = !/\W/.test(str) ?
			tplCache[str] = tplCache[str] ||
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

})($ || jQuery);