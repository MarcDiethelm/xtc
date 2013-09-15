
// WP7 can't be detected with conditional comments.
(navigator.userAgent.indexOf('Windows Phone') != -1 || navigator.userAgent.indexOf('WP7') != -1) && (document.documentElement.className += ' wp7');
$(document.documentElement).removeClass('no-js');

/**
 * Terrific Bootstrapping
 */
(function (window, Tc) {
	if (window.xtc && window.xtc.isTest) { return; }
	$(function() {
		var app
			,$body = $('body')
			,config = {
				dependencyPath: {
					library: window.assetsUrl + '/scripts/libs-dyn/',
					plugin:  window.assetsUrl + '/scripts/plugins-dyn/',
					util:    window.assetsUrl + '/scripts/utils-dyn/'
				}
			}
			,announceTcReady
		;

		// custom function for context selection
		Tc.Module.prototype.$$ = function $$(selector) {
			return this.$ctx.find(selector);
		};

		app = new Tc.Application($body, config);
		app.registerModules();
		app.registerModule($body, 'PageController');

		// After all modules are registered, register module tests
		window.xtc && window.xtc.ModuleTests && (announceTcReady = new xtc.ModuleTests(app));

		app.start();

		// Tell xtc.ModuleTests that we're ready and hand it a callback, which it will call when it's ready too.
		announceTcReady && announceTcReady(function(runTests) {
			runTests();
		});
	});
})(window, Tc);