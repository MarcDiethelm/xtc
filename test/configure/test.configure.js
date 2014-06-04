// load Node.js assertion module
var assert = require('assert')
	,_ = require('lodash-node')
	,fs
	,path
	,appPath
	,configr = require('../../lib/configure')
;

describe('configure', function() {

	var config = configr.get();

	it('config.root() should return a plain object', function() {
		assert.ok(_.isPlainObject(config.root()));
	});

	it('config.get(key) should retrieve value of config.set(key, value)', function() {
		var expected = 'potato';
		config.set('testVal', expected);
		var actual = config.get('testVal');
		assert.strictEqual(actual, expected);
	});

	describe('merge results', function() {

		var config;

		before(function() {
			fs = require('fs');
			path = require('path');
			appPath = path.resolve(process.cwd(), 'node_modules/generator-xtc/app/templates');

			config = configr.merge('test/configure/fixtures', ['project']);
		});

		it('default only value should equal default', function() {
			assert.equal(config.get('static.img'), 'img');
		});

		it('project value should override default value', function() {
			assert.equal(config.get('devPort'), 4444); // This value is set in test.setup.js via process.env.PORT
		});

		it('creates absolute app paths', function() {
			assert.equal(config.get('appPath'), appPath);
			assert.equal(config.get('staticPath'), path.join(appPath, 'frontend-example/public'));
		});
	});

});