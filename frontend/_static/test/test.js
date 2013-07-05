// use https://github.com/jquery/qunit-composite (?)
// again: handle module/template combinations
//      BUT: Tc app has no way of knowing what template we are using. (Unless we parse the annotation or add something
//      to the generated markup)
// include without block in template
// show test results in _home inline
(function() {
	Tc.tests = {};

	window.ModuleTest = function ModuleTest(app) {
		var i
			,tests = []
			,mod
			,modName
			,modNameHtml

			/**
			 * Gets the module name from a module instance
			 *
			 * @param {Module} instance The module instance
			 * @return {String} The appropriate module name
			 */
			,getModuleName = function(instance) {
				for (var modName in Tc.Module) {
					if (Tc.Module.hasOwnProperty(modName) && modName !== 'constructor' && instance instanceof Tc.Module[modName]) {
						instance.modName = modName;
						return modName;
					}
				}
			}
		;

		// look at the modules that exist on the page's Tc app and get the module names

		for (i = 0; i < app.modules.length, (mod = app.modules[i]); i++) {
			modName = getModuleName(mod);
			modNameHtml = modName.replace(/[A-Z]/g, function(match, charIndex) {
				var replaced = match.toLowerCase();
				charIndex && (replaced = '-' + replaced);
				return replaced;
			});

			// if the module has no test, skip it
			// if we already have the module/test, skip it
			if (!Tc.tests[modName] || Tc.tests[modName].isTesting) {
				continue;
			}

			Tc.tests[modName].isTesting = true;

			tests.push({
				 name: modName
				,nameHtml: modNameHtml
			});
		}
		this.tests = tests;
		this.$frame = $('<iframe id="_test-frame"/>').appendTo('body');
	};

	ModuleTest.prototype = {

		// the test runner
		run: function() {
			var test;

			if (this.tests.length) {
				test = this.tests.shift();
				this.loadModule(test, function() {
					this.testModule(test);
					// recursive
					this.run();
				});
			}
			else {
				this.$frame.remove();
			}
		}

		,loadModule: function(test, callback) {
			var self = this;
			this.$frame.src('/_test/'+test.nameHtml, function() {
				callback.call(self);
			});
		}

		,testModule: function(test) {
			var  $testBody = $(this.$frame[0].contentWindow.document.body)
				,$ctx = $testBody.find('.mod-' + test.nameHtml)
				,testApp = new Tc.Application($testBody)
				,mod
			;

			if ($ctx.length === 0) {
				$ctx = $testBody;
			}
			mod = testApp.registerModule($ctx, test.name);
			mod.modName = test.name;
			testApp.start();
			Tc.tests[test.name](mod);
			testApp.stop();
			testApp.unregisterModules();
		}
	};

	// Set up QUnit output

	QUnit.begin(function( details ) {
		console.groupCollapsed && console.groupCollapsed('Module Tests') || console.log('Module Tests');
	});

	QUnit.moduleStart(function( details ) {
		console.group && console.group( 'Module: '+ details.name ) || console.log( 'Module: '+ details.name );
	});

	QUnit.moduleDone(function( details ) {
		console.groupEnd && console.groupEnd();
	});

	QUnit.log(function( details ) {
		/*!details.result &&
			console.warn( 'Module test failed: ' + details.message);*/
		if (details.result) {
			console.log( 'Module test passed: ' + details.message);
		}
		else {
			console.warn( 'Module test failed: ' + details.message);
		}
	});

	QUnit.done(function( details ) {
		var consoleFn = details.failed === 0 ? 'info' : 'warn';
		console.groupEnd && console.groupEnd();
		console[consoleFn]('Passed: '+ details.passed +'/'+ details.total + ' | ', 'Failed: '+ details.failed );
	});

})();
