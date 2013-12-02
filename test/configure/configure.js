// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// load Node.js assertion module
var assert = require('assert')
	,_ = require('lodash')
	,fs
	,path
	,appPath
	,configr = require('../../lib/configure')
;

describe('configure', function() {

	var config;

	it('configure.get() should return a plain object', function() {
		config = configr.get();
		assert.ok(_.isPlainObject(config));
	});


	describe('merge results', function() {

		var config;

		before(function() {
			fs = require('fs');
			path = require('path');
			appPath = process.cwd();

			config = configr.merge('test/configure/fixtures', ['project']);
		});

		it('configure: default only value should equal default', function() {
			assert.equal(config.static.img, 'img');
		});

		it('configure: project value should override default value', function() {
			assert.equal(config.devPort, 3333);
		});

		it('configure: creates absolute app paths', function() {
			assert.equal(config.appPath, appPath);
			assert.equal(config.pathsAbsolute.staticBaseDir, path.join(appPath, 'frontend/_static/'));
		});
	});

});