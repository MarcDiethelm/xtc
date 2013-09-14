(function baseLib1() {
	console.log(arguments.callee.name);
})();

(function base1() {
	console.log(arguments.callee.name);
})();

(function($) {
	/**
	 * Module1 module implementation.
	 *
	 * @author mdiethelm
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Module1 = Tc.Module.extend({

		/**
		 * Initializes the Module1 module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
		}
	});
})(Tc.$);

(function($) {
	/**
	 * Module2 module implementation.
	 *
	 * @author mdiethelm
	 * @namespace Tc.Module
	 * @class Default
	 * @extends Tc.Module
	 */
	Tc.Module.Module2 = Tc.Module.extend({

		/**
		 * Initializes the Module2 module.
		 *
		 * @method init
		 * @constructor
		 * @param {jQuery|Zepto} $ctx the jquery context
		 * @param {Sandbox} sandbox the sandbox to get the resources from
		 * @param {String} modId the unique module id
		 */
		init: function($ctx, sandbox, modId) {
			// call base constructor
			this._super($ctx, sandbox, modId);
		},

		/**
		 * Hook function to do all of your module stuff.
		 *
		 * @method on
		 * @param {Function} callback function
		 * @return void
		 */
		on: function(callback) {
			callback();
		},

		/**
		 * Hook function to trigger your events.
		 *
		 * @method after
		 * @return void
		 */
		after: function() {
		}
	});
})(Tc.$);

(function($) {
	/**
	 * Skin1 Skin implementation for the Module1 module.
	 *
	 * @author mdiethelm
	 * @namespace Tc.Module.Module1
	 * @class Skin1
	 * @extends Tc.Module
	 * @constructor
	 */
	Tc.Module.Module1.Skin1 = function(parent) {
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

(function application1() {
	console.log(arguments.callee.name);
})();
