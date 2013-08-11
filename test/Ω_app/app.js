// force the test environment to 'test'
process.env.NODE_ENV = 'test';
var app
// load Node.js assertion module
var assert = require('assert');

describe('app', function() {

	before(function() {
		// get the application server module
		app = require('../../app');
		this.server = app.listen(3333);
	});

	it('should return an Express/Connect instance', function() {
		assert.ok(typeof app.listen == 'function');
	});

	after(function(done) {
		this.server.close(done);
	});
});