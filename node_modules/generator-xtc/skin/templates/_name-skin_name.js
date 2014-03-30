(function($) {
	/**
	 * <%= nameSkinJs %> Skin implementation for the <%= nameModuleJs %> module.
	 *
	 * @author <%= user %>
	 * @namespace Tc.Module.<%= nameModuleJs %>
	 * @class <%= nameSkinJs %>
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.<%= nameModuleJs %>.<%= nameSkinJs %> = function(parent) {
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
