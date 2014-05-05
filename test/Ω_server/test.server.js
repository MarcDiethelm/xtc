// load Node.js assertion module
var assert = require('assert');
var path = require('path');
var util = require('util');
var Zombie = require('zombie');
var log = console.log;
var removeLogger;
var logger;
var app;

describe('server', function() {

	var port = process.env.PORT;

	before(function() {
		this.timeout(5000);

		app = require(path.join(process.cwd(), 'node_modules/generator-xtc/app/templates/server.js'));
		this.server = app.xtc.createServer(app, 'http', {});
		this.server.listen(+port); // +: coerce type to number

		this.browser = new Zombie({silent: true});

		// Removing logger so we can use the default project middlewares without complications,
		// but also without request logging in the test output.
		logger = removeLogger(app);
	});

	it('should return an Express/Connect instance', function() {
		assert.ok(app.handle && app.set);
	});

	it('should serve an overview page', function(done) {
		this.browser
			.visit(
				util.format('http://localhost:%d/xtc', port) // Zombie's error handling is a bit weird
				,(function(err, browser) { // browser should be defined here, but isn't
					if (200 === this.browser.statusCode) {
						done();
					} else {
						done(this.browser.error);
					}
				}).bind(this)
			);
	});

	after(function(done) {
		this.server.close();
		done();
	});
});


removeLogger = function removeLogger(app) {

	for (var i = 0; i < app.stack.length; i++) {
		var handle = app.stack[i].handle;

		if ('logger' === handle.name) {
			app.stack[i].handle = function(req, res, next) {
				next();
			};

			return handle;
		}

	}
};