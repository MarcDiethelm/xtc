/*
So this is working nicely. EXCEPT, we basically need to test in the same layout as the original view is rendered in.
- How do we know which layout to use (we are listening to requests before other routes so they don't have to next anything)
	==> We'll just render it in the default template for now.
 */

(function() {

	xtc.ModuleTests = function(TcApp) {
		// init
		this.onTcAppReady = $.proxy(this.onTcAppReady, this);
		this.onTestFrameLoaded = $.proxy(this.onTestFrameLoaded, this);
		this.onRunTests = $.proxy(this.onRunTests, this);

		this.$frame = $('#_xtc-test-frame');
		this.jsOnlyModules = this.findJsOnlyModules(TcApp);
		this.loadTestFrame(this.onTestFrameLoaded);

		return this.onTcAppReady;
	};

	xtc.ModuleTests.prototype = {

		 tests: []
		,$testBody: undefined
		,testTcApp: undefined
		,readyCallback: undefined

		,loadTestFrame: function(iFrameReadyCallback) {
			this.$frame.src('/xtc/test/?url='+ encodeURIComponent(window.location.pathname), iFrameReadyCallback);
		}

		// user calls this when his app is ready and send us a callback to know when tests are ready too.
		,onTcAppReady: function(readyCallback) {
			this.readyCallback = readyCallback;
		}

		,onTestFrameLoaded: function() {
			this.setUpTestTcApp();
			// tests are ready to be run. tell the user and give him a callback to start testing
			this.readyCallback(this.onRunTests);
		}

		,onRunTests: function() {
			QUnit.start();
			this.runTests();
		}

		,onTestsComplete: function() {
			this.$frame.remove();
			this.testTcApp.stop();
			this.testTcApp.unregisterModules();
		}

		,setUpTestTcApp: function() {
			var  testFrameWindow = this.$frame[0].contentWindow
				,$testBody = this.$testBody = $(testFrameWindow.document.body)
				,app = this.testTcApp = new Tc.Application($testBody)
				,jsOnlyModule, modules, module
				,i, numTests, htmlName, jsName
			;

			for (i = 0; i < this.jsOnlyModules.length; i++) {
				jsOnlyModule = this.jsOnlyModules[i];
				jsOnlyModule.module = app.registerModule($testBody, jsOnlyModule.jsName);
				this.tests.push(jsOnlyModule);
			}

			modules = app.registerModules();

			// testFrameWindow.modules is a global var in the test iFrame (/_test/?url=...)
			for (i = 0, numTests = testFrameWindow.xtc.testModules.length; i < numTests; i++) {
				module = testFrameWindow.xtc.testModules[i];
				htmlName = 'mod-'+ module.name;
				jsName = this.htmlNameToJsName('-'+ module.name);
				this.tests.push({
					 name:      module.name
					,jsName:    jsName
					,htmlName:  htmlName
					,module:    modules[i] // Using the actual bound modules Terrific found in the page for correct markup.
					,template:  module.template
					,skins:     module.skins // skins are not strictly necessary, the user can get the info from the html class.
					,connectors:module.connectors
				});
			}
			app.start();
		}

		,findJsOnlyModules: function(TcApp) { // needs the real app on the real page
			var map = $.proxy(
				function(module) {
					if (module.$ctx.is('.mod'))
						return null;
					else
						return {
							 jsName: this.moduleInstanceToJsName(module)
							,module: module
						};
				}
				,this
			);

			return $.map(TcApp.modules, map);
		}

		,moduleInstanceToJsName: function(instance) {
			for (var modName in Tc.Module) {
				if (Tc.Module.hasOwnProperty(modName) && modName !== 'constructor' && instance instanceof Tc.Module[modName]) {
					instance.modName = modName;
					return modName;
				}
			}
		}

		/*,moduleJsNameToHtmlName: function(jsName) {
			return jsName.replace(/[A-Z]/g, function(match, charIndex) {
				var replaced = match.toLowerCase();
				charIndex && (replaced = '-' + replaced);
				return replaced;
			});
		}*/

		,htmlNameToJsName: function(htmlName) {
			return htmlName.replace(/(\-[A-Za-z])/g, function($1){return $1.toUpperCase().replace('-','');});
		}

		,optionsToTestModuleName: function(options) {
			var  template   = options.template != options.name  ? ',  Template: '+ options.template : ''
				,skins      = options.skins                     ? ',  Skins: '+ options.skins : ''
				,connectors = options.connectors                ? ',  Connectors: '+ options.connectors : ''
			;
			return 'Module: ' + options.jsName
				+ template
				+ skins
				+ connectors
			;
		}

		,runTests: function() {
			var test;

			if (this.tests.length) {
				test = this.tests.shift();
					this.testModule(test);
					// recursive
					this.runTests();
			}
			else {
				this.onTestsComplete();
			}
		}

		,testModule: function(test) {
			// if the module has no test, skip it
			if (!xtc.tests[test.jsName]) {
				return;
			}

			xtc.tests[test.jsName].prototype.name = this.optionsToTestModuleName(test);

			new xtc.tests[test.jsName](test.module, {
				 name:      test.jsName
				,template:  test.template
				,skins:     test.skins
				,connectors:test.connectors
			});
		}
	}


	if (window.console && xtc.tests.consoleOutput) {

		// Set up QUnit output
		var  log = $.proxy(console.log, console)
			,info = $.proxy(console.info, console)
			,warn = $.proxy(console.warn, console)
		if (!console.group) { // IE
			log = console.info;
			warn = console.error;
			info = console.info;
		}
	
		QUnit.begin(function( details ) {
			console.groupCollapsed ? console.groupCollapsed('Module Tests') : log('Module Tests');
		});
	
		QUnit.moduleStart(function( details ) {
			console.group ? console.group(details.name) : log( 'Module: '+ details.name );
		});
	
		QUnit.moduleDone(function( details ) {
			console.groupEnd && console.groupEnd();
		});
	
		QUnit.testStart(function( details ) {
			var testName = 'Test: '+ details.name;
			console.group ? console.group(testName) : log('└─ '+ testName);
		});
	
		QUnit.testDone(function( details ) {
			console.groupEnd && console.groupEnd();
		});
	
		QUnit.log(function( details ) {
			var  pre = console.group ? '' : '  └─ ';
			if (details.result) {
				log( pre +'Pass: ' + details.message);
			}
			else {
				warn( pre +'Fail: ' + details.message);
			}
		});
	
		QUnit.done(function( details ) {
			var consoleFn = details.failed === 0 ? info : warn;
			console.groupEnd && console.groupEnd();
			consoleFn('Passed: '+ details.passed +'/'+ details.total + ' | ', 'Failed: '+ details.failed );
		});
	}

})();

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