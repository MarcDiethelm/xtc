module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		,sources: {
			inline_css: [
				 'frontend/_terrific/_inline/css/lib/*.css'
				,'frontend/_terrific/_inline/css/*.less'
			]
			,external_css: [
				 'frontend/_terrific/_base/css/lib/*.css'
				,'frontend/_terrific/_base/css/elements/*.less'
				,'frontend/_terrific/mod-*/*.less'
				,'frontend/_terrific/mod-*/skin/*.less'
				,'frontend/_terrific/_application/css/*.less'
			]
			,inline_js: [
				 'frontend/_terrific/_inline/js/lib/*.js'
				,'frontend/_static/dist/templates-inline.jst'
				,'frontend/_terrific/_inline/js/*.js'
			]
			,external_js: [
				 'frontend/_terrific/_base/js/lib/*.js'
				,'frontend/_terrific/mod-*/*.js'
				,'frontend/_terrific/mod-*/skin/*.js'
				,'frontend/_terrific/_application/js/*.js'
			]
			,templates: [
				 'frontend/views/*.hbs'
				,'frontend/_terrific/mod-*/*.hbs'
			]
		},
		dest: 'frontend/_static/dist'

		//////////////////////////////////////////////////////////////

		,less_imports: {
			inline: {
				options: {}
				,src: '<%=sources.inline_css%>'
				,dest: '<%=dest%>/inline-imports.less'
			},
			external: {
				options: {}
				,src: '<%=sources.external_css%>'
				,dest: '<%=dest%>/external-imports.less'
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
				,src: '<%=dest%>/inline-imports.less'
				,dest: '<%=dest%>/inline.css'
			},
			external: {
				options: {}
				,src: '<%=dest%>/external-imports.less'
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
		,handlebars: {
			compile: {
				options: {
					namespace: "JST"
					,processName: function(filename) {
						// we just want the filename without path or extension
						// todo: make his work on windoze: handle backslash too
						return filename.split('/').pop().replace('.hbs', '');
					}
				}
				,src: '<%=sources.templates%>'
				,dest: '<%=dest%>/templates-inline.jst'
			}
		}
		,watch: {
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
		}
	});

	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-less-imports');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// create pipelines                             // use actual task name (first part before colon)!
	grunt.registerTask('build-inline-js',            ['concat:inline_scripts', 'uglify:inline']);
	grunt.registerTask('build-external-js',          ['concat:external_scripts', 'uglify:external']);
	grunt.registerTask('build-inline-css',           ['less_imports:inline', 'less:inline', 'cssmin:inline']);
	grunt.registerTask('build-external-css',         ['less_imports:external', 'less:external', 'cssmin:external']);
	grunt.registerTask('precompile-templates',       ['handlebars:compile']);

	// aggregate pipelines
	grunt.registerTask('default',
	[
		 'precompile-templates'
		,'build-inline-js'
		,'build-external-js'
		,'build-inline-css'
		,'build-external-css'
		,'watch'
	]);

};