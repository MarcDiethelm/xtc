/*
 * grunt-glue-nu
 * https://github.com/MarcDiethelm/grunt-glue-nu
 *
 * Copyright (c) 2013 Marc Diethelm
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js'
				,'tasks/*.js'
				//'<%= mochacli.all %>'
			]
			,options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['test/tmp']
		},

		// Configuration to be run (and then tested).
		glue: {
			options: {
				namespace: 's'
			}

			,zeroconf: {
				src: 'test/fixtures/icon/',
				dest: 'test/tmp/zeroconf'
			}
			,bundle_empty: {
				options: {},
				src: 'test/fixtures/empty/',
				dest: 'test/tmp'
			}
			,no_process_with_options: {
				options: {
					crop: true,
					bundleName: 'simple-dir'
				},
				src: [
					'test/fixtures/icon/'
				],
				dest: 'test/tmp/simple-dir'
			}
			,glueargs: {
				options: {
					glueArgs: '--crop test/fixtures/icon/ test/tmp/glueargs'
				}
			}
			,'default': {
				options: {},
				src: [
					'test/fixtures/**/*.{png,jpg,conf}'
				],
				dest: 'test/tmp/default'
			}
			,default_folders: {
				options: {
					bundleName: 'folders'
					,'sprite-namespace': 'folders'
					,project: false
				},
				src: [
					 'test/fixtures/icon'
					,'test/fixtures/retina/*.{png,jpg,conf}'
				],
				dest: 'test/tmp/folders'
			}
			,retina: {
				options: {
					 retina: true
					,url: '/static/'
					//,imagemagick: true
				},
				src:'test/fixtures/retina',
				dest: 'test/tmp/retina'
			}
			,'less': {
				options: {
					 less: true // Boolean or since glue 0.9.2 optionally specific path
					,url: '/static/'
				},
				src:'test/fixtures/icon', // outout
				dest: 'test/tmp/less'
			}
			,'retina-less': {
				options: {
					 less: true // Boolean or since glue 0.9.2 optionally specific path
					,retina: true
					,url: '/static/'
				},
				src:'test/fixtures/retina', // outout
				dest: 'test/tmp/retina-less'
			}
		},

		// Unit tests.
		mochacli: {
			options: {
				//require: ['should'],
				reporter: 'spec',
				bail: true
			},
			all: ['test/*.js']
		}

	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-mocha-cli');

	// Whenever the "test" task is run, first clean the "tmp" dir, then run this
	// plugin's task(s), then test the result.
	grunt.registerTask('test', ['clean', 'glue'/*, 'mochacli'*/]);

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint', 'test']);

};
