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
