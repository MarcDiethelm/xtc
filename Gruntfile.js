module.exports = function(grunt) {

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Read project configuration

	var  path = require('path')
		,configr = require('./lib/configure')
		,cfg ,modulesPattern ,buildBaseDirDev, buildBaseDirDist
		,isDistBuild = grunt.option('dist') || false
	;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Get project configuration

	// Override project config, if command line options contain config options (for testing)
	cfg = grunt.option('config-path') && grunt.option('config-files')
		? configr.merge(grunt.option('config-path'), grunt.option('config-files').split(','))
		: configr.get()
	;

	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Create vars from config

	modulesPattern = path.join(cfg.paths.modulesBaseDir, cfg.moduleDirName.replace('{{name}}', '*'))
	buildBaseDirDev = path.join(cfg.paths.staticBaseDir, cfg.static.build.baseDirNameDev); // build.baseDirNameDev may be empty
	buildBaseDirDist = path.join(cfg.paths.staticBaseDir, cfg.static.build.baseDirNameDist); // build.baseDirNameDist may be empty


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define grunt config

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json')

		,staticUriPrefix            : (cfg.staticUriPrefix || '') + '/'
		,staticUriPrefixCss         : cfg.staticUriPrefix


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Sources base paths

		,tcInline                   : cfg.paths.inline
		,tcBase                     : cfg.paths.base
		,spritesDir                 : '<%=tcBase%>/css/sprites'
		,tcModules                  : modulesPattern
		,tcApplication              : cfg.paths.application
		,staticDir                  : cfg.paths.staticBaseDir


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Output destinations

		,baseDirName                : cfg.static.build.baseDirName

		,buildBaseDirDev            : buildBaseDirDev
		,tmp                        : '<%=buildBaseDirDev%>/tmp'
		,destJsDev                  : '<%=buildBaseDirDev%>'
		,destCssDev                 : '<%=buildBaseDirDev%>'
		,destSpritesCssDev          : '<%=spritesDir%>' // technically this should go in tmp, but we want the generated classes in our base css for easy lookup.
		,destSpritesImgDev          : '<%=buildBaseDirDev%>'

		,buildBaseDirDist           : buildBaseDirDist
		,destJsDist                 : '<%=buildBaseDirDist%>'
		,destCssDist                : '<%=buildBaseDirDist%>'
		,destSpritesImgDist         : '<%=buildBaseDirDist%>'


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Directory names

		,skinsDirName               : cfg.skinsDirName


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
				,'<%=tcBase%>/css/*.less'
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
			,sprites_watch: [
				 '<%=spritesDir%>/**/*.{png|jpg|conf}'
				//,'<%=tcModules%>/sprites/*.{png|jpg|conf}' // not implemented yet
			]
		}


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Configure Grunt plugins

		,glue: {
			// see: https://github.com/MarcDiethelm/grunt-glue-nu
			options: {
				 css                : '<%=destSpritesCssDev%>'
				,less               : true
				,url                : '<%=staticUriPrefix%><%=baseDirName%>'
				,namespace          : ''
				,'sprite-namespace' : ''
				,optipng            : true
			}
			,sprites: {
				options: {
					'sprite-namespace' : 's' // set to inline-block in sprites-helper.less
				}
				,src                : ['<%=spritesDir%>/misc', '<%=tcModules%>/sprites']
				,dest               : '<%=buildBaseDirDev%>'
			}
		}

		,less_imports: {
			inline: {
				 src                : '<%=sources.inline_css%>'
				,dest               : '<%=tmp%>/inline-imports.less'
			},
			external: {
				options: {}
				,src                : '<%=sources.external_css%>'
				,dest               : '<%=tmp%>/external-imports.less'
			}
		}

		,concat: {
			inline_scripts: {
				options: {
					banner          : '/*! Inline script dependencies for page bootstrapping */\n'
				}
				,src                : '<%=sources.inline_js%>'
				,dest               : '<%=destJsDev%>/inline.js'
			}
			,external_scripts: {
				 src                : '<%=sources.external_js%>'
				,dest               : '<%=destJsDev%>/external.js'
			}
			,module_tests: {
				 src                : '<%=sources.module_test_js%>'
				,dest               : '<%=destJsDev%>/test.js'
			}
		}

		,uglify: {
			inline: {
				options: {
					preserveComments: 'some'
				}
				,src                : '<%=destJsDev%>/inline.js'
				,dest               : '<%=destJsDist%>/inline.min.js'
			},
			external: {
				 src                : '<%=destJsDev%>/external.js'
				,dest               : '<%=destJsDist%>/external.min.js'
			}
		}

		,less: {
			inline: {
				options: {
					                // cssmin will not create file if the output is empty. a special comment fixes this.
					 banner         : '/*! Inline style dependencies for page bootstrapping */'
					,imports: {
						reference   : ['<%=tcInline%>/css/lib/reference/*.less']
					}
				}
				,src                : '<%=tmp%>/inline-imports.less'
				,dest               : '<%=destCssDev%>/inline.css'
			}
			,external: {
				options: {
					 banner         : "@static-prefix: '<%=staticUriPrefixCss%>';"
					,imports: {
						reference   : ['<%=tcBase%>/css/lib/reference/*.less']
					}
				}
				,src                : '<%=tmp%>/external-imports.less'
				,dest               : '<%=destCssDev%>/external.css'
			}
		}

		,cssmin: {
			inline: {
				 src                : '<%=destCssDev%>/inline.css'
				,dest               : '<%=destCssDist%>/inline.min.css'
			},
			external: {
				 src                : '<%=destCssDev%>/external.css'
				,dest               : '<%=destCssDist%>/external.min.css'
			}
		}

		,jshint: {
			options: {
				// report but don't fail
				force               : true
				// enforce
				,latedef            : true
				,undef              : true
				//relax
				,laxcomma           : true
				,smarttabs          : true
				,expr               : true
				,asi                : true
				,loopfunc           : true
				,nonew              : true
				// environment
				,browser            : true
				,jquery             : true
				,globals: {
					$               : true
					,Tc             : true
					,xtc            : true
					,console        : true
					// Lawg
					,log            : true
					,dir            : true
					,info           : true
					,debug          : true
					,warn           : true
					,error          : true
					,table          : true
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
			,inline                 : ['<%=sources.jshint_inline%>']
			,external               : ['<%=sources.jshint_external%>']
			,module_tests           : ['<%=sources.jshint_module_test%>']
		}

		,watch: {
			sprites: {
				 files              : ['<%=sources.sprites_watch%>']
				,tasks              : ['build-sprites', 'build-external-css']
			},
			inline_styles: {
				 files              : ['<%=sources.inline_css%>', '<%=tcInline%>/css/lib/reference/*.less']
				,tasks              : ['build-inline-css']
			},
			external_styles: {
				 files              : ['<%=sources.external_css%>', '<%=tcBase%>/css/lib/reference/*.less']
				,tasks              : ['build-external-css']
			}
			,inline_scripts: {
				 files              : ['<%=sources.inline_js%>']
				,tasks              : ['build-inline-js']
			}
			,external_scripts: {
				 files              : ['<%=sources.external_js%>']
				,tasks              : ['build-external-js']
			}
			,module_tests: {
				 files              : ['<%=sources.module_test_js%>']
				,tasks              : ['build-module-tests']
			}
			,gruntfile: {
				 files              : ['Gruntfile.js']
				,tasks              : devBuild
			}
		}

		,copy: {
			spritesDist: {
				 src                : '<%=buildBaseDirDev%>/*.png'
				,dest               : '<%=buildBaseDirDist%>'
			}
		}

		,log: {
			options: {
				 bold: true
				,color: 'green'
			}
			,devCssDone: {
				msg: 'Dev CSS complete'
			}
			,devJsDone: {
				msg: 'Dev JS complete'
			}
		}
	});


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define build tasks                            // use actual task name (first part before colon)!

	grunt.registerTask('build-sprites',              ['glue']);
	grunt.registerTask('build-inline-js',            ['concat:inline_scripts', 'jshint:inline']);
	grunt.registerTask('build-external-js',          ['concat:external_scripts', 'log:devJsDone', 'jshint:external',]);
	grunt.registerTask('build-inline-css',           ['less_imports:inline',   'less:inline', 'log:devCssDone']);
	grunt.registerTask('build-external-css',         ['less_imports:external', 'less:external']);
	grunt.registerTask('build-module-tests',         ['concat:module_tests' , 'jshint:module_tests']);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define the build pipes

	var devBuild = [
		 'build-sprites'
		,'build-external-css'
		,'build-external-js'
		,'build-inline-css'
		,'build-inline-js'
		,'build-module-tests'
		,'watch'
	];

	var distBuild = [
		 'build-sprites'
		,'build-external-css'
		,'build-external-js'
		,'build-inline-css'
		,'build-inline-js'
		,'build-module-tests'

		,'uglify:inline'
		,'uglify:external'
		,'cssmin:inline'
		,'cssmin:external'
		,'copy:spritesDist'
	];

	var task = isDistBuild ? distBuild : devBuild;

	// If sprites building is not enabled in the app config, remove it.
	!cfg.enableSpritesBuilding && task.shift();
	grunt.registerTask('default', task);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Load grunt plugins

	grunt.loadNpmTasks('grunt-glue-nu');
	grunt.loadNpmTasks('grunt-less-imports');
	grunt.loadNpmTasks('assemble-less');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Ad-hoc plugin

	grunt.registerMultiTask('log', 'a console logging task', function() {
		var options = this.options()
			,color = options.color || false
		;

		if (options.bold) {
			grunt.log.subhead(this.data.msg[color]);
		}
		else {
			grunt.log.writeln(this.data.msg[color]);
		}
	});

	grunt.registerMultiTask('copy', 'Copy spritesheets builds to dist destination', function() {

		this.filesSrc.forEach(function(file) {
			var fileName = file.split('/').pop();
			grunt.file.copy( file, path.join(buildBaseDirDist, fileName) );
		});

	});

};
