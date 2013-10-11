xtc.tests.Example = function(mod, options) {

	 // Start a QUnit module for this Terrific module
	module(this.name, {
		 // prepare something for each following test()
		setup: function () {},
		 // clean up after each test()
		teardown: function () {}
	});

	test( 'Dummy', function() {
		
		if (!mod.$ctx.is('.skin-example-alternate')) {
			strictEqual( mod.$$('.debug').length, 1, 'Appends debug text.' );
		}
		else {
			ok( mod.$ctx.is('.skin-example-alternate'), 'Is .skin-example-alternate.' );
			strictEqual( mod.$$('.debug').length, 2, 'Appends debug texts.' );
		}
	});
};