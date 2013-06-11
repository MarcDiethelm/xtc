module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		,sources: {
			inline_css: [
				 'frontend/_terrific/_inline/css/lib/*.css'
				,'frontend/_terrific/_inline/css/*.less'
			]
			,external_css: [
				 'frontend/_terrific/_base/css/sprites/*.less'
				,'frontend/_terrific/_base/css/lib/*.css'
				,'frontend/_terrific/_base/css/elements/*.less'
				,'frontend/_terrific/mod-*/*.less'
				,'frontend/_terrific/mod-*/skin/*.less'
				,'frontend/_terrific/_application/css/*.less'
			]
			,inline_js: [
				 'frontend/_terrific/_inline/js/lib/*.js'
				,'frontend/_terrific/_inline/js/*.js'
			]
			,external_js: [
				 'frontend/_terrific/_base/js/lib/*.js'
				,'frontend/_terrific/mod-*/*.js'
				,'frontend/_terrific/mod-*/skin/*.js'
				,'frontend/_terrific/_application/js/*.js'
			]
			,module_test_js: [
				 'frontend/_static/test/*.js'
				,'frontend/_terrific/mod-*/test/*.js'
			]
			,sprites: [
				'frontend/_terrific/_base/css/sprites/'
				//,'frontend/_terrific/mod-*/sprites/'
			]
		}
		,tmp: 'frontend/_static/dist/tmp'
		,dest: 'frontend/_static/dist'
		,dest_sprites_css: 'frontend/_terrific/_base/css/sprites/' // technically this should go in <%=dest%>/tmp, but we want the generated classes in our base css for easy lookup.

		//////////////////////////////////////////////////////////////

		,glue: {
			icons: {
				src: '<%=sources.sprites%>'
				//,dest: '<%=dest_sprites_css%>/00-sprites.less'
				,options: '--css=<%=dest_sprites_css%> --img=<%=dest%> --less --url=/dist --namespace= --sprite-namespace= --recursive --crop --optipng'
			}
		}
		,less_imports: {
			inline: {
				options: {}
				,src: '<%=sources.inline_css%>'
				,dest: '<%=tmp%>/inline-imports.less'
			},
			external: {
				options: {}
				,src: '<%=sources.external_css%>'
				,dest: '<%=tmp%>/external-imports.less'
			}
		}
		,concat: {
			inline_scripts: {
				 src: '<%=sources.inline_js%>'
				,dest: '<%=dest%>/inline.js'
			}
			,external_scripts: {
				 src: '<%=sources.external_js%>'
				,dest: '<%=dest%>/external.js'
			}
			,module_tests: {
				 src: '<%=sources.module_test_js%>'
				,dest: '<%=dest%>/test.js'
			}
		},
		uglify: {
			inline: {
				src: '<%=dest%>/inline.js'
				,dest: '<%=dest%>/inline.min.js'
			},
			external: {
				src: '<%=dest%>/external.js'
				,dest: '<%=dest%>/external.min.js'
			}
		}
		,less: {
			inline: {
				options: {}
				,src: '<%=tmp%>/inline-imports.less'
				,dest: '<%=dest%>/inline.css'
			},
			external: {
				options: {}
				,src: '<%=tmp%>/external-imports.less'
				,dest: '<%=dest%>/external.css'
			}
		},
		cssmin: {
			inline: {
				files: {
					'<%=dest%>/inline.min.css': ['<%=dest%>/inline.css']
				}
			},
			external: {
				files: {
					'<%=dest%>/external.min.css': ['<%=dest%>/external.css']
				}
			}
		}
		,watch: {
			sprites: {
				files: ['<%=sources.sprites%>']
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
	
	grunt.registerTask('build-inline-js',            [                 'concat:inline_scripts',   'uglify:inline']);
	grunt.registerTask('build-external-js',          ['build-sprites', 'concat:external_scripts', 'uglify:external']);
	grunt.registerTask('build-inline-css',           ['less_imports:inline',   'less:inline',   'cssmin:inline']);
	grunt.registerTask('build-external-css',         ['less_imports:external', 'less:external', 'cssmin:external']);
	grunt.registerTask('build-module-tests',         ['concat:module_tests']);

	// aggregate pipelines
	grunt.registerTask('default',
	[
		 'build-inline-js'
		,'build-external-js'
		,'build-inline-css'
		,'build-external-css'
		,'build-module-tests'
		,'watch'
	]);

};