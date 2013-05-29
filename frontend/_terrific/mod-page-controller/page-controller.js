(function($) {
	/**
	 * PageController module implementation.
	 *
	 * @author 
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.PageController = Tc.Module.extend({

		/**
		 * Initializes the PageController module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId, modName) {
			// call base constructor
			this._super($ctx, sandbox, modId, modName);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			this.$ctx.append('\n<br><span class="debug">JS Module &quot;PageController&quot; started</span>');
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
			console.log('module PageController after()')
		}
	});
})(Tc.$);