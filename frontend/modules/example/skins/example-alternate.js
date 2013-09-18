(function($) {
	/**
	 * Basic Skin implementation for the Example module.
	 *
	 * @author 
	 * @namespace Tc.Module.Default
	 * @class Basic
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Example.Alternate = function(parent) {
		/**
		 * override the appropriate methods from the decorated module (ie. this.get = function()).
		 * the former/original method may be called via parent.<method>()
		 */
		this.on = function(callback) {
			// calling parent method
			parent.on(callback);

			parent.$ctx.append('\n<br><span class="debug">JS skin &quot;Example.Alternate&quot; started</span>');
		};

		this.after = function() {
			// calling parent method
			parent.after();
		};
	};
})(Tc.$);
