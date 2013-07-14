// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module
//var app = require('../app');
// load Node.js assertion module
var assert = require('assert');
// use zombie.js as headless browser
//var Browser = require('zombie');
var grunt = require('grunt');
var terrific, config;

describe('terrific', function() {

	before(function() {
		//this.server = app.listen(3000);

		config = require('../app_modules/configure')
			.merge('test/_config/', ['default'])
			.merge('test/fixtures/terrific-modules/', ['basic'])
			.get();
		terrific = require('../app_modules/terrific')(config);
		//this.browser = new Browser({ site: 'http://localhost:'+ config.devPort });
	});

	it('should render a basic test module', function() {
		var actual = terrific.renderModule({}, { name: 'basic' });
		var expected = grunt.file.read('test/expected/terrific-modules/basic/basic.html');
		assert.equal(actual, expected);
	});

	/*after(function(done) {
		this.server.close(done);
	});*/
});