(function() {
	Tc.tests = {};
// todo: handle modules that have no markup
	window.ModuleTest = function ModuleTest(app) {
		var i
			,tests = []
			,mod
			,modName
		;

		// look at the modules that exist on the page's Tc app and get the module names
		for (i = 0; i < app.modules.length, mod = app.modules[i]; i++) {
			modName = mod.$ctx[0].className.split(' ')[1]
			modName = Tc.Utils.String.toCamel(modName).replace('mod', '');

			// if the module has no test, goto next
			// if we already have the module/test, goto next
			if (!Tc.tests[modName] || Tc.tests[modName].isTesting) {
				continue;
			}

			Tc.tests[modName].isTesting = true;

			tests.push({
				 name: modName
				,$node: mod.$ctx.clone(true, true)
			});
		}
		this.tests = tests;
	};

	ModuleTest.prototype = {

		run: function() {
			var i, test
				,testApp = new Tc.Application()
			;

			for (i = 0; i < this.tests.length, test = this.tests[i]; i++) {
				$ctx = $(test.$node).wrap('<div/>').parent(); // Terrific needs this...

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
