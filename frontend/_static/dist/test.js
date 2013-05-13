(function() {
	Tc.tests = {};
// todo: handle modules that have no markup
// todo: avoid testing multiple occurrences of the same module!
	window.ModuleTest = function ModuleTest(app) {
		var i
			,tests = []
			,mod
			,modName
		;

		for (i = 0; i < app.modules.length, mod = app.modules[i]; i++) {
			modName = mod.$ctx[0].className.split(' ')[1]
			modName = Tc.Utils.String.toCamel(modName).replace('mod', '');

			if (!Tc.tests[modName]) {
				continue;
			}

			tests.push({
				 name: modName
				,$node: mod.$ctx.clone(true, true)
			});
		}
		this.tests = tests;
	};

	ModuleTest.prototype = {

		run: function() {
			var i, test, $node
				,testApp = new Tc.Application()
				,moduleInstance
			;

			for (i = 0; i < this.tests.length, test = this.tests[i]; i++) {
				$ctx = $(test.$node).wrap('<div/>').parent(); // Terrific needs this...
				//moduleInstance = testApp.sandbox.addModules($ctx)[0]
				// run the test
				Tc.tests[test.name]( test.name, $ctx, testApp );
				console.groupEnd();
			}
		}
	};


	QUnit.begin(function( details ) {
		console.groupCollapsed('Module Tests')
	});

	QUnit.moduleStart(function( details ) {
		console.group( 'Module: '+ details.name );
	});

	QUnit.moduleDone(function( details ) {
		console.groupEnd();
	});

	QUnit.log(function( details ) {
		!details.result &&
			console.warn( 'Module test failed: ' + details.message);
	});

	QUnit.done(function( details ) {
		console.groupEnd();
		var consoleFn = details.failed == 0 ? 'info' : 'warn';
		console[consoleFn]('Passed: '+ details.passed +'/'+ details.total + ' | ', 'Failed: '+ details.failed );
	});

})();

Tc.tests.BootstrapCarousel = function( modName, $node, testApp ) {

	 // Start a QUnit module for this Terrific module
	module(modName, {
		 // prepare something for each following tests
		setup: function () {
			 // Create a new instance of the Terrific module for each test() below.
			this.mod = testApp.registerModule($node, modName);
			this.mod.start();
		},
		 // clean up after each test()
		teardown: function () {
			testApp.unregisterModules(this.mod);
		}
	});

	test( 'dummy tests', function() {

		strictEqual( this.mod.$ctx.is('.skin-alternate'), false, 'Isn\'t CSS skin-alternate.' );
		strictEqual( this.mod.$$('.debug').length, 1, 'Appends debug text.' );
	});
};

Tc.tests.Example = function( modName, $node, testApp ) {

	 // Start a QUnit module for this Terrific module
	module(modName, {
		 // prepare something for each following tests
		setup: function () {
			 // Create a new instance of the Terrific module for each test() below.
			this.mod = testApp.registerModule($node, modName);
			this.mod.start();
		},
		 // clean up after each test()
		teardown: function () {
			testApp.unregisterModules(this.mod);
		}
	});

	test( 'dummy tests', function() {

		strictEqual( this.mod.$ctx.is('.skin-alternate'), true, 'Isn\'t CSS skin-alternate.' );
		strictEqual( this.mod.$$('.debug').length, 1, 'Appends debug text.' );
	});
};
