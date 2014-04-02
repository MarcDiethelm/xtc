
/**
 * Select elements in the module context. Usage: this.$$(selector)
 * @param {string} selector
 * @returns {jQuery} – jQuery collection
 */
Tc.Module.prototype.$$ = function $$(selector) {
	return this.$ctx.find(selector);
};

/**
 * Bind methods to Terrific module context.  Usage: this.bindAll(funcName [,funcName...])
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
		if (typeof this[methodName] == 'function') {
			this[methodName] = $.proxy(this, methodName);
		}
		else {
			throw new TypeError('Tc.Module.'+ this.getName() +'.'+ methodName +' is not a function');
		}
	}
	return true;
};

/**
 * Get the name of the Terrific module
 * @returns {string}
 */
Tc.Module.prototype.getName = function() {
	var property;
	if (!this._modName) {
		for (property in Tc.Module) {
			if (Tc.Module.hasOwnProperty(property) && property !== 'constructor' && this instanceof Tc.Module[property]) {
				this._modName = property;
				return property;
			}
		}
	}
};