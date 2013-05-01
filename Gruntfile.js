module.exports = function(grunt) {

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')

		,sources: {
			inline_js: [
				 'frontend/terrific/0_inline/js/lib/*.js'
				,'frontend/_static/dist/templates-inline.jst'
				,'frontend/terrific/0_inline/js/*.js'
			]
			,external_js: [
				 'frontend/terrific/1_base/js/lib/*.js'
				,'frontend/terrific/2_modules/mod-*/*.js'
				,'frontend/terrific/2_modules/mod-*/skin/*.js'
				,'frontend/terrific/3_application/*.js'
			]
			,external_css: [
				 'frontend/terrific/1_base/css/lib/*.css'
				,'frontend/terrific/1_base/css/elements/*.less'
				,'frontend/terrific/2_modules/mod-*/*.less'
				,'frontend/terrific/2_modules/mod-*/skin/*.less'
				,'frontend/terrific/3_application/*.less'
			]
			,templates: [
				 'frontend/views/*.hbs'
				,'frontend/terrific/2_modules/mod-*/*.hbs'
			]
		},
		dest: 'frontend/_static/dist'

		//////////////////////////////////////////////////////////////

		,less_imports: {
			external_styles: {
				options: {}
				,src: '<%=sources.external_css%>'
				,dest: '<%=dest%>/styles-imports.less'
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
		}
		,less: {
			external_styles: {
				options: {}
				//,src: '<%=sources.external_css%>'
				,src: '<%=dest%>/styles-imports.less'
				,dest: '<%=dest%>/styles.css'
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
			styles: {
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
	grunt.loadNpmTasks('grunt-contrib-handlebars');
	grunt.loadNpmTasks('grunt-contrib-watch');

	// create pipelines                             // use actual task name (first part before colon)!
	grunt.registerTask('build-inline-js',            ['concat:inline_scripts']);
	grunt.registerTask('build-external-js',          ['concat:external_scripts']);
	grunt.registerTask('less-imports',               ['less_imports:external_styles']);
	grunt.registerTask('build-external-css',         ['less:external_styles']);
	grunt.registerTask('precompile-templates',       ['handlebars:compile']);

	// aggregate pipelines
	grunt.registerTask('default',
	[
		 'precompile-templates'
		,'build-inline-js'
		,'build-external-js'
		,'less-imports'
		,'build-external-css'
		,'watch'
	]);

};