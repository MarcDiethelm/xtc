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

	describe('basics', function() {

		it('configure: should be chainable', function() {
			var configure = require('../app_modules/configure').merge('test/fixtures/config', ['default']);
			configure.merge('test/fixtures/configure', ['default']);
			assert.ok(configure.merge);
		});
	});


	describe('merge results', function() {

		var config;

		before(function() {
			fs = require('fs');
			path = require('path');
			appPath = fs.realpathSync('.'); // resolves to the app dir probably because mocha was called from there

			config = require('../app_modules/configure')
				.merge('test/fixtures/configure', [
					 'default'
					,'project'
				])
				.get();
		});

		it('configure: get() should return a plain object', function() {
			// underscore only test if it is an object not if it's a plain object
			assert.ok(_.isObject(config));
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