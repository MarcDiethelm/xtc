// WP7 can't be detected with conditional comments.
(navigator.userAgent.indexOf('Windows Phone') != -1 || navigator.userAgent.indexOf('WP7') != -1) && (document.documentElement.className += ' wp7');

$(document.documentElement).removeClass('no-js');

/**
 * Terrific Bootstrapping
 */
(function (window, Tc) {
	// If running inside a test frame, bail out.
	if (window.xtc && window.xtc.isTest) { return; }
	
	$(function() {
		var  app
			,$body = $('body')
			,config = {}
			,announceTcReady
		;

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