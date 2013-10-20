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

describe('terrific::renderModule', function() {

	before(function() {
		//this.server = app.listen(3000);

		config = require('../../lib/configure')
			.merge('_config/', ['default'])
			.merge('test/_config/', ['test'])
			.merge('test/terrific-modules/', ['terrific'])
			.get();
		terrific = require('../../lib/terrific')(config);
		//this.browser = new Browser({ site: 'http://localhost:'+ config.devPort });
	});

	it('should render a basic module', function() {
		var actual = terrific.renderModule({}, { name: 'basic' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic.html');
		assert.equal(actual, expected);
	});
	it('should output a meaningful error when template can\'t be read', function() {
		var actual = 'invalid test'
		try {
			actual = terrific.renderModule({}, { name: 'qwerty', template: 'uiop' });
		} catch (e) {
			// nothing to do here
		}
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-read-error.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with alternate template', function() {
		var actual = terrific.renderModule({}, { name: 'basic', template: 'alternate' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-alternate.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with skins', function() {
		var actual = terrific.renderModule({}, { name: 'basic', skins: ['zebra', 'crocodile'] });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-skins.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with a custom tag', function() {
		var actual = terrific.renderModule({}, { name: 'basic', tag: 'article' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-tag.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with an id attribute', function() {
		var actual = terrific.renderModule({}, { name: 'basic', id: 'unique' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-id.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with specified attributes, incl. data-connectors', function() {
		var actual = terrific.renderModule({}, { name: 'basic', id: 'unique', attributes: [{key:'data-connectors', value:'stats, filter'}, {key:'lang', value:'de-CH'}, {key:'data-1', value: "{'key': 'val'}"}] });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-attributes.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with HTML classes', function() {
		var actual = terrific.renderModule({}, { name: 'basic', htmlClasses: 'vis-hidden form' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-html-classes.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with injected data merged with context', function() {
		var actual = terrific.renderModule({ fee: 100, foo: 'bar' }, { name: 'basic', data: {fee: 'fi', fo: 'fum'}, template: 'data' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-data.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, with a nested module', function() {
		var actual = terrific.renderModule({}, { name: 'basic', template: 'nested' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-nested.html');
		assert.equal(actual, expected);
	});
	it('should render an empty module', function() {
		var actual = terrific.renderModule({}, { name: 'basic', template: 'empty' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-empty.html');
		assert.equal(actual, expected);
	});
	it('should provide Handlebars helpers in module', function() {
		var actual = terrific.renderModule({}, { name: 'basic', template: 'helper' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-helper.html');
		assert.equal(actual, expected);
	});
	// Annotations enabled...
	it('should render an annotated module', function() {
		config = require('../../lib/configure')
			.merge('_config/', ['default'])
			.merge('test/_config/', ['test'])
			.merge('test/terrific-modules/', ['terrific-annotate'])
			.get();
		terrific = require('../../lib/terrific')(config);

		var actual = terrific.renderModule({}, { name: 'basic', template: 'alternate' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-annotated.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, without wrapper and without annotation', function() {
		var actual = terrific.renderModule({}, { name: 'basic', noWrapper: true });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-no-wrapper.html');
		assert.equal(actual, expected);
	});

	/*after(function(done) {
		this.server.close(done);
	});*/
});