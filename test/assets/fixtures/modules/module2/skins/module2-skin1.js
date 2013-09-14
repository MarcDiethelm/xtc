(function($) {
	/**
	 * Skin1 Skin implementation for the Module2 module.
	 *
	 * @author mdiethelm
	 * @namespace Tc.Module.Module2
	 * @class Skin1
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Module2.Skin1 = function(parent) {
		/**
		 * override the appropriate methods from the decorated module (ie. this.get = function()).
		 * the former/original method may be called via parent.<method>()
		 */
		this.on = function(callback) {
			// calling parent method
			parent.on(callback);
		};

		this.after = function() {
			// calling parent method
			parent.after();
		};
	};
})(Tc.$);
