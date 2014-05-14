
var path = require('path');
var assert = require('assert');
var app;
var handlebars;

describe('helpers', function() {

	/*it('should return a helper object', function() {
		assert.ok(app.helpers);
	});*/

	before(function() {
		app = require(path.join(process.cwd(), 'node_modules/generator-xtc/app/templates/server.js'));
	});


	it('should register Handlebars helpers', function() {
		handlebars = require('handlebars');
		assert.ok(handlebars.helpers.mod);
		assert.ok(handlebars.helpers.inline);
	});


	it('should register users\'s Handlebars helpers', function() {
		handlebars = require('handlebars');
		assert.ok(handlebars.helpers.stringify);
	});
});