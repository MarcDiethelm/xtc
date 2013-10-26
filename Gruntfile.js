module.exports = function(grunt) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Read project configuration

	var  path = require('path')
		,configPath = '_config/'
		,configFiles = [
			 'default'
			,'project'
			,'secret'
			,'local'
		]
		,cfg ,modulesPattern ,buildBaseDir
	;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Read test configuration (if testing)

	// Override project config, if command line options contain a config location.
	configPath = grunt.option('config-path') || configPath;
	configFiles = grunt.option('config-files') && grunt.option('config-files').split(',') || configFiles;

	// Merge configurations
	cfg = require('./lib/configure').merge(configPath, configFiles).get();


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Create vars from config

	modulesPattern = path.join(cfg.paths.modulesBaseDir, cfg.moduleDirName.replace('{{name}}', '*'))
	buildBaseDir = path.join(cfg.paths.staticBaseDir, cfg.static.build.baseDirName); // build.baseDirName may be empty


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define grunt config

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json')

		,staticUriPrefix        : (cfg.staticUriPrefix || '') + '/'
		,staticUriPrefixCss     : cfg.staticUriPrefix


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Sources base paths

		,tcInline               : cfg.paths.inline
		,tcBase                 : cfg.paths.base
		,tcModules              : modulesPattern
		,tcApplication          : cfg.paths.application
		,staticDir              : cfg.paths.staticBaseDir


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Output destinations

		,baseDirName            : cfg.static.build.baseDirName
		,buildBaseDir           : buildBaseDir
		,tmp                    : '<%=buildBaseDir%>/tmp'
		,destJs                 : '<%=buildBaseDir%>'
		,destCss                : '<%=buildBaseDir%>'
		,destSpritesCss         : '<%=tcBase%>/css/sprites' // technically this should go in tmp, but we want the generated classes in our base css for easy lookup.
		,destSpritesImg         : '<%=buildBaseDir%>'


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Directory names

		,skinsDirName           : cfg.skinsDirName


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Define source file patterns

		,sources: {
			inline_css: [
				 '<%=tcInline%>/css/lib/*.{less,css}'
				,'<%=tcInline%>/css/*.less'
			]
			,external_css: [
				 '<%=tcBase%>/css/sprites/*.less'
				,'<%=tcBase%>/css/lib/*.{less,css}'
				,'<%=tcBase%>/css/elements/*.less'
				,'<%=tcModules%>/*.less'
				,'<%=tcModules%>/<%=skinsDirName%>/*.less'
				,'<%=tcApplication%>/css/*.less'
			]
			,inline_js: [
				 '<%=tcInline%>/js/lib/*.js'
				,'<%=tcInline%>/js/*.js'
			]
			,external_js: [
				 '<%=tcBase%>/js/lib/*.js'
				,'<%=tcBase%>/js/*.js'
				,'<%=tcModules%>/*.js'
				,'<%=tcModules%>/<%=skinsDirName%>/*.js'
				,'<%=tcApplication%>/js/*.js'
			]
			,module_test_js: [
				 '<%=staticDir%>/test/*.js'
				,'<%=tcModules%>/test/*.js'
			]
			,jshint_inline: [
				 '<%=tcInline%>/js/*.js'
			]
			,jshint_external: [
				 '<%=tcModules%>/*.js'
				,'<%=tcModules%>/<%=skinsDirName%>/*.js'
				,'<%=tcApplication%>/js/*.js'
			]
			,jshint_module_test: [
				 '<%=staticDir%>/_static/test/*.js'
				,'<%=tcModules%>/test/*.js'
			]
			,sprites: [
				'<%=tcBase%>/css/sprites/'
				//,'<%=tcModules%>/sprites/' // not implemented
			]
		}


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Configure Grunt plugins

		,glue: {
			icons: {
				src: '<%=sources.sprites%>'
				//,dest: '<%=destSpritesCss%>/00-sprites.less' // not implemented
				,options: '--css=<%=destSpritesCss%> --img=<%=destSpritesImg%> --less --url=<%=staticUriPrefix%><%=baseDirName%> --namespace=s --sprite-namespace= --recursive --crop --optipng --force --debug'
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

		,concat: {
			inline_scripts: {
				options: {
					banner: '/*! Inline script dependencies for page bootstrapping */\n'
				}
				,src: '<%=sources.inline_js%>'
				,dest: '<%=destJs%>/inline.js'
			}
			,external_scripts: {
				 src: '<%=sources.external_js%>'
				,dest: '<%=destJs%>/external.js'
			}
			,module_tests: {
				 src: '<%=sources.module_test_js%>'
				,dest: '<%=destJs%>/test.js'
			}
		}

		,uglify: {
			inline: {
				options: {
					preserveComments: 'some'
				}
				,src: '<%=destJs%>/inline.js'
				,dest: '<%=destJs%>/inline.min.js'
			},
			external: {
				 src: '<%=destJs%>/external.js'
				,dest: '<%=destJs%>/external.min.js'
			}
		}

		,less: {
			inline: {
				options: {
					 // cssmin will not create file if the output is empty. a special comment fixes this.
					 banner: '/*! Inline style dependencies for page bootstrapping */'
					,imports: {
						reference: ['<%=tcInline%>/css/lib/reference/*.less']
					}
				}
				,src: '<%=tmp%>/inline-imports.less'
				,dest: '<%=destCss%>/inline.css'
			}
			,external: {
				options: {
					 banner: "@static-prefix: '<%=staticUriPrefixCss%>';"
					,imports: {
						reference: ['<%=tcBase%>/css/lib/reference/*.less']
					}
				}
				,src: '<%=tmp%>/external-imports.less'
				,dest: '<%=destCss%>/external.css'
			}
		}

		,cssmin: {
			inline: {
				 src: '<%=destCss%>/inline.css'
				,dest: '<%=destCss%>/inline.min.css'
			},
			external: {
				 src: '<%=destCss%>/external.css'
				,dest: '<%=destCss%>/external.min.css'
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
				,nonew: true
				// environment
				,browser: true
				,jquery: true
				,globals: {
					$: true
					,Tc: true
					,xtc: true
					// Lawg
					,log: true
					,dir: true
					,info: true
					,debug: true
					,warn: true
					,error: true
					,table: true
					// QUnit ಠ_ಠ
					,asyncTest      : true
					,deepEqual      : true
					,equal          : true
					,expect         : true
					,module         : true
					,notDeepEqual   : true
					,notEqual       : true
					,notStrictEqual : true
					,ok             : true
					,QUnit          : true
					,raises         : true
					,start          : true
					,stop           : true
					,strictEqual    : true
					,test           : true
				}
			}
			,inline: ['<%=sources.jshint_inline%>']
			,external: ['<%=sources.jshint_external%>']
			,module_tests: ['<%=sources.jshint_module_test%>']
		}

		,watch: {
			sprites: {
				files: ['<%=sources.sprites%>*.{png,jpg}']
				,tasks: ['build-sprites', 'build-external-css']
			},
			inline_styles: {
				files: ['<%=sources.inline_css%>', '<%=tcInline%>/css/lib/reference/*.less']
				,tasks: ['build-inline-css']
			},
			external_styles: {
				files: ['<%=sources.external_css%>', '<%=tcBase%>/css/lib/reference/*.less']
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


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define build tasks                            // use actual task name (first part before colon)!

	grunt.registerTask('build-sprites',              ['glue']);
	grunt.registerTask('build-inline-js',            ['concat:inline_scripts', 'uglify:inline', 'jshint:inline']);
	grunt.registerTask('build-external-js',          ['concat:external_scripts', 'uglify:external', 'jshint:external',]);
	grunt.registerTask('build-inline-css',           ['less_imports:inline',   'less:inline',   'cssmin:inline']);
	grunt.registerTask('build-external-css',         ['less_imports:external', 'less:external', 'cssmin:external']);
	grunt.registerTask('build-module-tests',         ['concat:module_tests' , 'jshint:module_tests']);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define a default task

	var defaultTask = [
		 'build-sprites'
		,'build-external-css'
		,'build-external-js'
		,'build-inline-css'
		,'build-inline-js'
		,'build-module-tests'
		,'watch'
	];

	// If sprites building is not enabled in the app config, remove it.
	!cfg.enableSpritesBuilding && defaultTask.shift();
	grunt.registerTask('default', defaultTask);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Load grunt plugins

	grunt.loadNpmTasks('grunt-glue');
	grunt.loadNpmTasks('grunt-less-imports');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');

};
