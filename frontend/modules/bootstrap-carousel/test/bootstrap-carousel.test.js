xtc.tests.BootstrapCarousel = function(mod, options) {

	 // Start a QUnit module for this Terrific module
	module(this.name, {
		 // prepare something for each following tests
		setup: function () {},
		 // clean up after each test()
		teardown: function () {}
	});

	test( 'Dummy', function() {

		strictEqual( mod.$$('.debug').length, 1, 'Appends debug text.' );
	});
};
