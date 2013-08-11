// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// load Node.js assertion module
var assert = require('assert')
	,_ = require('underscore')
	,fs
	,path
	,appPath
;

describe('configure', function() {
		
	var configure, config;

	it('should be chainable', function() {
		// chain directly
		configure = require('../lib/configure').merge('test/fixtures/config', ['default']);
		// can we still use merge?
		configure.merge('test/fixtures/configure', ['default']);
		assert.ok(configure.get);
	});
	it('configure.get() should return a plain object', function() {
		config = configure.get();
		// underscore only tests if it is an object not if it's a plain object
		assert.ok(_.isObject(config));
	});


	describe('merge results', function() {

		var config;

		before(function() {
			fs = require('fs');
			path = require('path');
			appPath = fs.realpathSync('.'); // resolves to the app dir probably because mocha was called from there

			config = require('../lib/configure')
				.merge('test/fixtures/configure', [
					 'default'
					,'project'
				])
				.get();
		});

		it('configure: default only value should equal default', function() {
			assert.equal(config.static.img, '/img');
		});

		it('configure: project value should override default value', function() {
			assert.equal(config.devPort, 3333);
		});

		it('configure: creates absolute app paths', function() {
			assert.equal(config.dirname, appPath);
			assert.equal(config.pathsAbsolute.staticBaseDir, path.join(appPath, 'frontend/_static/'));
		});
	});

});