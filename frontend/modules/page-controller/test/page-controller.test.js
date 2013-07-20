Tc.tests.PageController = function( modName, $node, testApp ) {
	 // Start a QUnit module for this Terrific module
	module(modName, {
		 // prepare something for each following tests
		setup: function () {
			 // Create a new instance of the Terrific module for each test() below.
			var $ctx = $node.clone(true, true);
			this.mod = testApp.registerModule($ctx, modName);
			this.mod.start();
		},
		 // clean up after each test()
		teardown: function () {
			testApp.unregisterModules(this.mod);
		}
	});

	test( 'dummy tests', function() {

		strictEqual( this.mod.$$('.debug').length, 1, 'Appends debug text.' );
	});
};
