// force the test environment to 'test'
process.env.NODE_ENV = 'test';
// get the application server module
//var app = require('../app');
// load Node.js assertion module
var assert = require('assert');
// use zombie.js as headless browser
//var Browser = require('zombie');
var grunt = require('grunt');
var config;

describe('asset building', function() {

	describe('default config', function() {

		describe('external JS', function() {

			before(function(done) {
				runGrunt(['build-external-js', '-config-path=test/assets', '-config-files=default,assets-default'], done);
			});

			it('should create external.js', function() {
				var exists = grunt.file.isFile('test/assets/build/external.js');
				assert.ok(exists);
			});

			it('should concatenate external scripts correctly', function() {
				var actual = grunt.file.read('test/assets/build/external.js');
				var expected = grunt.file.read('test/assets/expected/external.js');
				assert.equal(actual, expected);
			});
		});

		describe('external js', function() {

			before(function(done) {
				runGrunt(['build-external-css', '-config-path=test/assets', '-config-files=default,assets-default'], done);
			});

			it('should create external.css', function() {
				var exists = grunt.file.isFile('test/assets/build/external.css');
				assert.ok(exists);
			});

			it('should concatenate external styles correctly', function() {
				var actual = grunt.file.read('test/assets/build/external.css');
				var expected = grunt.file.read('test/assets/expected/external-default.css');
				assert.equal(actual, expected);
			});
		});

		// Clean up

		after(function() {
			if (grunt.file.exists('test/assets/build')) {
				grunt.file.delete('test/assets/build');
			}
		});
	});


	describe('static uri config', function() {

		describe('external CSS', function() {

			before(function(done) {
				runGrunt(['build-external-css', '-config-path=test/assets', '-config-files=default,assets,assets-uri'], done);
			});

			it('should create correct static uri', function() {
				var actual = grunt.file.read('test/assets/build/external.css');
				var expected = grunt.file.read('test/assets/expected/external-uri.css');
				assert.equal(actual, expected);
			});

		});

		// Clean up

		after(function() {
			if (grunt.file.exists('test/assets/build')) {
				grunt.file.delete('test/assets/build');
			}
		});
	});

});


function runGrunt(args, done) {
	var options = {
		 cmd: 'grunt'
		,args: args
	}
	grunt.util.spawn(options, function(error, result, code) {
		if (error) {
			console.log(result.stdout)
			throw(error);
		}
		done();
	});
}