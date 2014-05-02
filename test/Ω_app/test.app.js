var app;
// load Node.js assertion module
var assert = require('assert');

describe('app', function() {

	before(function() {
		// get the application server module
		app = require('../../server');
		this.server = app.listen(process.env.PORT);
	});

	it('should return an Express/Connect instance', function() {
		assert.ok(typeof app.listen == 'function');
	});

	after(function(done) {
		this.server.close(done);
	});
});