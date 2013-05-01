(function($) {
	/**
	 * Basic Skin implementation for the Foo module.
	 *
	 * @author Foo B. Baz
	 * @namespace Tc.Module.Default
	 * @class Basic
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Foo.Alternate = function(parent) {
		/**
		 * override the appropriate methods from the decorated module (ie. this.get = function()).
		 * the former/original method may be called via parent.<method>()
		 */
		this.on = function(callback) {
			// calling parent method
			parent.on(callback);
			parent.$ctx.append('\n<br><span>skin foo alternate started</span>');
		};

		this.after = function() {
			// calling parent method
			parent.after();
		};
	};
})(Tc.$);
