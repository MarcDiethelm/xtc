Tc.tests.BootstrapCarousel = function(mod) {

	 // Start a QUnit module for this Terrific module
	module(mod.modName, {
		 // prepare something for each following tests
		setup: function () {},
		 // clean up after each test()
		teardown: function () {}
	});

	test( 'dummy tests', function() {

		strictEqual( mod.$ctx.is('.skin-alternate'), false, 'Isn\'t CSS skin-alternate.' );
		strictEqual( mod.$$('.debug').length, 1, 'Appends debug text.' );
	});
};
