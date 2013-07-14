// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module
var app = require('../app');
// load Node.js assertion module
var assert = require('assert');

describe('helpers', function() {

	before(function() {
		this.server = app.listen(3000);
	});

	/*it('should return a helper object', function() {
		assert.ok(app.helpers);
	});*/

	after(function(done) {
		this.server.close(done);
	});
});