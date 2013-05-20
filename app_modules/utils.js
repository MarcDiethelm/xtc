module.exports = {
	/**
	 * Create a (shallow-cloned) duplicate of an object.
	 * @param obj
	 * @returns {{}}
	 */
	clone: function(obj) {
		var target = {};
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				target[i] = obj[i];
			}
		}
		return target;
	}
	,
	/**
	 * Extend a given object with all the properties in passed-in object(s).
	 * @param obj
	 * @returns {*}
	 */
	extend: function (obj) {
		Array.prototype.slice.call(arguments, 1)
		.forEach(function (source) {
			if (source) {
				for (var prop in source) {
					obj[prop] = source[prop];
				}
			}
		});
		return obj;
	}
}