xtc.tests.PageController = function(mod, options) {

	 // Start a QUnit module for this Terrific module
	module(this.name, {
		 // prepare something for each following test()
		setup: function () {},
		 // clean up after each test()
		teardown: function () {}
	});

	test( 'Dummy #1', function() {

		ok( true, 'Basic testing works.' );
	});
};
