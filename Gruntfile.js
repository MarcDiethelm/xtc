module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		,sourcePrefix: 'frontend'
		,sources: {
			inline_css: [
				 '<%=sourcePrefix%>/_terrific/_inline/css/lib/*.css'
				,'<%=sourcePrefix%>/_terrific/_inline/css/*.less'
			]
			,external_css: [
				 '<%=sourcePrefix%>/_terrific/_base/css/sprites/*.less'
				,'<%=sourcePrefix%>/_terrific/_base/css/lib/*.css'
				,'<%=sourcePrefix%>/_terrific/_base/css/elements/*.less'
				,'<%=sourcePrefix%>/_terrific/mod-*/*.less'
				,'<%=sourcePrefix%>/_terrific/mod-*/skin/*.less'
				,'<%=sourcePrefix%>/_terrific/_application/css/*.less'
			]
			,inline_js: [
				 '<%=sourcePrefix%>/_terrific/_inline/js/lib/*.js'
				,'<%=sourcePrefix%>/_terrific/_inline/js/*.js'
			]
			,external_js: [
				 '<%=sourcePrefix%>/_terrific/_base/js/lib/*.js'
				,'<%=sourcePrefix%>/_terrific/mod-*/*.js'
				,'<%=sourcePrefix%>/_terrific/mod-*/skin/*.js'
				,'<%=sourcePrefix%>/_terrific/_application/js/*.js'
			]
			,module_test_js: [
				 '<%=sourcePrefix%>/_static/test/*.js'
				,'<%=sourcePrefix%>/_terrific/mod-*/test/*.js'
			]
			,sprites: [
				'<%=sourcePrefix%>/_terrific/_base/css/sprites/'
				//,'<%=sourcePrefix%>/_terrific/mod-*/sprites/'
			]
		}
		,destPrefix: 'frontend/_static/dist'
		,tmp: '<%=destPrefix%>/tmp'
		,dest_js: '<%=destPrefix%>'
		,dest_css: '<%=destPrefix%>'
		,dest_sprites_css: 'frontend/_terrific/_base/css/sprites' // technically this should go in tmp, but we want the generated classes in our base css for easy lookup.
		,dest_sprites_img: '<%=destPrefix%>'
		,staticUriPrefix: '/static'

		//////////////////////////////////////////////////////////////

		,glue: {
			icons: {
				src: '<%=sources.sprites%>'
				//,dest: '<%=dest_sprites_css%>/00-sprites.less'
				,options: '--css=<%=dest_sprites_css%> --img=<%=dest_sprites_img%> --less --url=<%=staticUriPrefix%> --namespace= --sprite-namespace= --recursive --crop --optipng'
			}
		}
		,less_imports: {
			inline: {
				src: '<%=sources.inline_css%>'
				,dest: '<%=tmp%>/inline-imports.less'
			},
			external: {
				options: {}
				,src: '<%=sources.external_css%>'
				,dest: '<%=tmp%>/external-imports.less'
			}
		}
		,jshint: {
			options: {
				// report but don't fail
				force: true
				// enforce
				,latedef: true
				,undef: true
				//relax
				,laxcomma: true
				,smarttabs: true
				,expr: true
				,asi: true
				,loopfunc: true
				// environment
				,browser: true
				,globals: {
					 $: true
					,Tc: true
					,ModuleTest: true
					,log: true
				}
			}
			,inline: ['<%=sources.jshint_inline%>']
			,external: ['<%=sources.jshint_external%>']
			//,module_tests: ['<%=sources.jshint_module_test%>']
		}
		,concat: {
			inline_scripts: {
				options: {
					banner: '/*! Inline script dependencies for page bootstrapping */\n'
				}
				,src: '<%=sources.inline_js%>'
				,dest: '<%=dest_js%>/inline.js'
			}
			,external_scripts: {
				 src: '<%=sources.external_js%>'
				,dest: '<%=dest_js%>/external.js'
			}
			,module_tests: {
				 src: '<%=sources.module_test_js%>'
				,dest: '<%=dest_js%>/test.js'
			}
		},
		uglify: {
			inline: {
				options: {
					preserveComments: 'some'
				}
				,src: '<%=dest_js%>/inline.js'
				,dest: '<%=dest_js%>/inline.min.js'
			},
			external: {
				src: '<%=dest_js%>/external.js'
				,dest: '<%=dest_js%>/external.min.js'
			}
		}
		,less: {
			inline: {
				options: {
					// cssmin will not create file if the output is empty. a special comment fixes this.
					banner: '/*! */'
				}
				,src: '<%=tmp%>/inline-imports.less'
				,dest: '<%=dest_css%>/inline.css'
			},
			external: {
				options: {
					banner: "@static-prefix: '<%=staticUriPrefix%>';"
				}
				,src: '<%=tmp%>/external-imports.less'
				,dest: '<%=dest_css%>/external.css'
			}
		},
		cssmin: {
			inline: {
				files: {
					'<%=dest_css%>/inline.min.css': ['<%=dest_css%>/inline.css']
				}
			},
			external: {
				files: {
					'<%=dest_css%>/external.min.css': ['<%=dest_css%>/external.css']
				}
			}
		}
		,watch: {
			sprites: {
				files: ['<%=sources.sprites%>*.png', '<%=sources.sprites%>*.jpg']
				,tasks: ['build-sprites', 'build-external-css']
			},
			inline_styles: {
				files: ['<%=sources.inline_css%>']
				,tasks: ['build-inline-css']
			},
			external_styles: {
				files: ['<%=sources.external_css%>']
				,tasks: ['build-external-css']
			}
			,inline_scripts: {
				files: ['<%=sources.inline_js%>']
				,tasks: ['build-inline-js']
			}
			,external_scripts: {
				files: ['<%=sources.external_js%>']
				,tasks: ['build-external-js']
			}
			,module_tests: {
				files: ['<%=sources.module_test_js%>']
				,tasks: ['build-module-tests']
			}
		}
	});

	grunt.loadNpmTasks('grunt-glue');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-less-imports');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// create pipelines                              // use actual task name (first part before colon)!
	grunt.registerTask('build-sprites',              ['glue']);
	
	grunt.registerTask('build-inline-js',            ['concat:inline_scripts',   'uglify:inline']);
	grunt.registerTask('build-external-js',          ['concat:external_scripts', 'uglify:external']);
	grunt.registerTask('build-inline-css',           ['less_imports:inline',   'less:inline',   'cssmin:inline']);
	grunt.registerTask('build-external-css',         ['less_imports:external', 'less:external', 'cssmin:external']);
	grunt.registerTask('build-module-tests',         ['concat:module_tests']);

	// aggregate pipelines
	grunt.registerTask('default',
	[
		 'build-inline-js'
		,'build-external-js'
		,'build-inline-css'
		,'build-sprites'
		,'build-external-css'
		,'build-module-tests'
		,'watch'
	]);

};