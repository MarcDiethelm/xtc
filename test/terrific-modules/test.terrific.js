// get the application server module
//var app = require('../app');
// load Node.js assertion module
var assert = require('assert');
// use zombie.js as headless browser
//var Browser = require('zombie');
var grunt = require('grunt');
var renderModule, config;
var configr = require('../../lib/configure');

require('../../lib/handlebars-helpers-xtc.js');

describe('renderModule', function() {

	before(function() {

		config = configr.merge('../../../../test/terrific-modules/', ['terrific'], config).root();
		renderModule = require('../../lib/mod-render')(config);
	});

	it('should render a basic module', function() {
		var actual = renderModule({}, { name: 'basic' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic.html');
		assert.equal(actual, expected);
	});
	it('should output a meaningful error when template can\'t be read', function() {
		var actual = 'invalid test';
		try {
			actual = renderModule({}, { name: 'qwerty', template: 'uiop' });
		} catch (e) {
			// nothing to do here
		}
		assert.ok(~actual.indexOf("Can't read template file. Module: qwerty, Template: qwerty-uiop.hbs<br/>Reason: ENOENT, no such file or directory"));
	});
	it('should render a module with alternate template', function() {
		var actual = renderModule({}, { name: 'basic', template: 'alternate' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-alternate.html');
		assert.equal(actual, expected);
	});
	it('should render a module with skins', function() {
		var actual = renderModule({}, { name: 'basic', skins: ['zebra', 'crocodile'] });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-skins.html');
		assert.equal(actual, expected);
	});
	it('should render a module with a custom tag', function() {
		var actual = renderModule({}, { name: 'basic', tag: 'article' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-custom-tag.html');
		assert.equal(actual, expected);
	});
	it('should render a module with an id attribute', function() {
		var actual = renderModule({}, { name: 'basic', id: 'unique' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-id.html');
		assert.equal(actual, expected);
	});
	it('should render a module with specified attributes, incl. data-connectors', function() {
		var actual = renderModule({}, { name: 'basic', id: 'unique', attributes: [{key:'data-connectors', value:'stats, filter'}, {key:'lang', value:'de-CH'}, {key:'data-1', value: "{'key': 'val'}"}] });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-attributes.html');
		assert.equal(actual, expected);
	});
	it('should render a module with HTML classes', function() {
		var actual = renderModule({}, { name: 'basic', classes: 'vis-hidden form' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-html-classes.html');
		assert.equal(actual, expected);
	});
	it('should render a module with injected data merged with context', function() {
		var actual = renderModule({ a: 'a-ctx', b: 'b-ctx' }, { name: 'basic', template: 'data', data: {a: 'a-mod', c: 'c-mod'} });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-data.html');
		assert.equal(actual, expected);
	});
	it('should provide Handlebars helpers in module', function() {
		var actual = renderModule({}, { name: 'basic', template: 'helper' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-helper.html');
		assert.equal(actual, expected);
	});
	it('should render modules with indentation', function() {
		var actual = renderModule({ indent: 1 }, { name: 'basic', indent: 2});
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-indent.html');
		assert.equal(actual, expected);
	});
	it('should render nested modules', function() {
		var actual = renderModule({}, { name: 'basic', template: 'nested'});
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-nested.html');
		assert.equal(actual, expected);
	});
	it('should render nested module with helper calls', function() {
		var actual = renderModule({}, { name: 'basic', template: 'nested-helpers'});
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-nested-helpers.html');
		assert.equal(actual, expected);
	});
	it('should render nested modules with data', function() {
		var actual = renderModule(
			{ a: 'a-ctx', b: 'b-ctx', c: 'c-ctx', obj: { a: 'ctx-obj' } },
			{ name: 'basic', template: 'nested-data', data: {a: 'a-mod1', b: 'b-mod1'} }
		);
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-nested-data.html');
		assert.equal(actual, expected);
	});
	it('should render an empty module', function() {
		var actual = renderModule({}, { name: 'basic', template: 'empty' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-empty.html');
		assert.equal(actual, expected);
	});

	// Annotations enabled...

	it('should render an annotated module', function() {
		config = configr.merge('../../../../test/terrific-modules/', ['terrific-annotate'], config).root();
		renderModule = require('../../lib/mod-render')(config);

		var actual = renderModule({}, { name: 'basic', template: 'alternate' });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-annotated.html');
		assert.equal(actual, expected);
	});
	it('should render a basic module, without wrapper and without annotation', function() {
		var actual = renderModule({}, { name: 'basic', noWrapper: true });
		var expected = grunt.file.read('test/terrific-modules/expected/basic/basic-no-wrapper.html');
		assert.equal(actual, expected);
	});
});
