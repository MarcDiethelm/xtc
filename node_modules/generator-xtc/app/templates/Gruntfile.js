module.exports = function(grunt) {

	var xtcPath = 	grunt.option('base');
	var path = require('path');
	var loadGruntTasks = require(path.join(xtcPath, 'node_modules/load-grunt-tasks'));
	var base = __dirname;
	var configr;
	var cfg ,modulesPattern, buildBaseDirName, buildPath, buildPathJs, buildPathCss, buildPathSpriteSheets;
	var isDistBuild = grunt.option('dist') || false; // based on this value we will execute a dev or dist build

	process.env.NODE_ENV = grunt.option('dist') ? 'production' : 'development';

	if (grunt.option('test') || process.env.testRun) { // xtc dev stuff
		process.env.xtcDev = true;
		base = xtcPath = process.cwd();
	}


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Be nice

	grunt.log.writeln('\n────────────────────────────────────────'.magenta);
	grunt.log.writeln('xtc %s build, %s'.magenta, process.env.NODE_ENV, (new Date).toLocaleTimeString());


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Get project configuration

	grunt.file.setBase(base); // Let configure.js work relative to here (Gruntfile.js)
	configr = require(path.join(xtcPath, 'lib/configure'));
	grunt.file.setBase(xtcPath); // Point grunt back to xtc, so it finds grunt installed there locally

	// Override project config, if command line options contain config options (for testing)
	cfg = grunt.option('config-path') && grunt.option('config-files')
		? configr.merge(grunt.option('config-path'), grunt.option('config-files').split(','))
		: configr.get()
	;


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Create vars from config

	modulesPattern = path.join(cfg.get('sources.modulesBaseDir'), cfg.get('moduleDirName').replace('{{name}}', '*'));
	buildBaseDirName = isDistBuild ? cfg.get('build.baseDirNameDist') : cfg.get('build.baseDirNameDev');
	buildPath             = path.join(cfg.get('buildBasePath'), buildBaseDirName);                       // buildBaseDirName can be empty
	buildPathJs           = path.join(cfg.get('buildBasePath'), buildBaseDirName, cfg.get('build.js.dirName')); // cfg:build.js.dirName can be empty
	buildPathCss          = path.join(cfg.get('buildBasePath'), buildBaseDirName, cfg.get('build.css.dirName')); // cfg:build.css.dirName can be empty
	buildPathSpriteSheets = path.join(cfg.get('buildBasePath'), buildBaseDirName, cfg.get('build.spriteSheets.dirName')); // cfg:build.css.dirName can be empty


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define grunt config

	grunt.initConfig({

		 staticBaseUriCss           : cfg.get('staticBaseUri')
		,staticBaseUri              : (cfg.get('staticBaseUri') || '') + '/'


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Sources base paths

		,tcInline                   : cfg.get('sources.inline')
		,tcBase                     : cfg.get('sources.base')
		,spritesPath                : '<%=tcBase%>/css/sprites'
		,tcModules                  : modulesPattern
		,tcApplication              : cfg.get('sources.application')
		,staticDir                  : cfg.get('staticPath')


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Output destinations

		//,baseDirName                : cfg.build.baseDirName

		,buildPath                  : buildPath             // dynamic, depends on build mode (development/production)
		,buildBaseDirName           : buildBaseDirName          // dynamic, depends on build mode (development/production)
		,tmpPath                    : '<%=buildPath%>/tmp'

		,destJs                     : buildPathJs
		,destCss                    : buildPathCss
		,destSpritesImg             : buildPathSpriteSheets
		,destSpritesCss             : '<%=spritesPath%>'        // technically this should go in tmp, but we want the generated classes in our base css for easy lookup.


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Directory names

		,skinsDirName               : cfg.get('skinsDirName')


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
				 '<%=staticDir%>/lib/test/test.js'
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
				'<%=tcModules%>/test/*.js'
			]
			,sprites_watch: [
				 '<%=spritesPath%>/**/*.{png,jpg,conf}'
				,'<%=tcModules%>/sprites/*.{png,jpg,conf}'
			]
		}


		////////////////////////////////////////////////////////////////////////////////////////////////////////////////
		// Configure Grunt plugins

		,glue: {
			// see: https://github.com/MarcDiethelm/grunt-glue-nu
			options: {
				 less               : '<%=destSpritesCss%>'
				,url                : '<%=staticBaseUri%><%=buildBaseDirName%>/'
				,namespace          : ''
				,'sprite-namespace' : ''
				,retina             : true
			}
			,sprites: {
				options: {
					'sprite-namespace' : 's' // styled inline-block in sprites-helper.less
				}
				,src                : [
					 '<%=spritesPath%>/icons'
					,'<%=tcModules%>/sprites'
				]
				,dest               : '<%=buildPath%>'
			}
		}

		,less_imports: {
			inline: {
				 src                : '<%=sources.inline_css%>'
				,dest               : '<%=tmpPath%>/inline-@import.less'
			},
			external: {
				options: {}
				,src                : '<%=sources.external_css%>'
				,dest               : '<%=tmpPath%>/external-@import.less'
			}
		}

		,concat: {
			inline_scripts: {
				options: {
					banner          : '/*! Inline script dependencies for page bootstrapping */\n'
				}
				,src                : '<%=sources.inline_js%>'
				,dest               : '<%=destJs%>/inline.js'
			}
			,external_scripts: {
				 src                : '<%=sources.external_js%>'
				,dest               : '<%=destJs%>/external.js'
			}
			,module_tests: {
				 src                : '<%=sources.module_test_js%>'
				,dest               : '<%=destJs%>/test.js'
			}
		}

		,uglify: {
			inline: {
				options: {
					preserveComments: 'some'
				}
				,src                : '<%=destJs%>/inline.js'
				,dest               : '<%=destJs%>/inline.min.js'
			},
			external: {
				 src                : '<%=destJs%>/external.js'
				,dest               : '<%=destJs%>/external.min.js'
			}
		}

		,less: {
			options: {
				 globalVars: {
					'static-base'   : '"'+cfg.get('staticBaseUri')+'"'
				}
				,outputSourceFiles  : true
				//,sourceMapRootpath  : '<%=staticBaseUri%>' // no effect
				//,sourceMapBasepath  : '/foo'
				,imports: {
					// Can't get this to work! Aha! --> https://github.com/assemble/assemble-less/issues/22
					//reference   : ['<%=tcBase%>/css/lib/reference/*.less']
					//reference   : [path.relative(buildPath + '/tmp', cfg.sources.base +'/css/lib/reference')+'/helpers.less']
					//reference   : [path.resolve(process.cwd(), cfg.sources.base +'/css/lib/reference')+'/helpers.less']
				}
			}
			,inline: {
				options: {
					// cssmin will not create file if the output is empty. a special comment fixes this.
					 banner         : '/*! Inline style dependencies for page bootstrapping */'
					,sourceMap      : true
					,sourceMapFilename : '<%=destCss%>/inline.css.map'
					,sourceMapURL   : 'inline.css.map'
				}
				,src                : '<%=tmpPath%>/inline-@import.less'
				,dest               : '<%=destCss%>/inline.css'
			}
			,external: {
				options: {
					 sourceMap: true
					,sourceMapFilename : '<%=destCss%>/external.css.map'
					,sourceMapURL   : 'external.css.map'
				}
				,src                : '<%=tmpPath%>/external-@import.less'
				,dest               : '<%=destCss%>/external.css'
			}
			,inlineDist: {
				options: {
					 cleancss       : true
					,report         : 'min'
				}
				,src                : '<%=tmpPath%>/inline-@import.less'
				,dest               : '<%=destCss%>/inline.min.css'
			}
			,externalDist: {
				options: {
					 cleancss       : true
					,report         : 'min'
				}
				,src                : '<%=tmpPath%>/external-@import.less'
				,dest               : '<%=destCss%>/external.min.css'
			}
		}

		// After dist build remove all non-minified files.
		,clean: {
			options: {
				force: true
			}
			,dist: {
				src: [
					 '<%=destCss%>/*.{png,css}'
					,'<%=destJs%>/*.{js}'
				]
			}
			,temp: {
				src: [
					 '<%=tmpPath%>'
					,'<%=destJs%>/inline.js'
					,'<%=destJs%>/external.js'
				]
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
			options: {
				//cwd                 : '../..',
				spawn                 : false
			}
			,sprites: {
				 files              : ['<%=sources.sprites_watch%>']
				,tasks              : ['build-sprites', 'build-external-css']
			},
			inline_styles: {
				 files              : ['<%=sources.inline_css%>', '<%=tcInline%>/css/lib/reference.less']
				,tasks              : ['build-inline-css']
			},
			external_styles: {
				 files              : ['<%=sources.external_css%>', '<%=tcBase%>/css/lib/reference.less']
				,tasks              : ['build-external-css']
			}
			,inline_scripts: {
				 files              : ['<%=sources.inline_js%>']
				,tasks              : ['build-inline-js', 'jshint:inline']
			}
			,external_scripts: {
				 files              : ['<%=sources.external_js%>']
				,tasks              : ['build-external-js', 'jshint:external']
			}
			,module_tests: {
				 files              : ['<%=sources.module_test_js%>']
				,tasks              : ['build-module-tests', 'jshint:module_tests']
			}
			,gruntfile: {
				 files              : ['Gruntfile.js']
				,tasks              : 'default'
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
	// Define dev build tasks                // format: [task:target, task:target] in grunt terminology

	grunt.registerTask('build-sprites',      ['glue']);
	grunt.registerTask('build-module-tests', ['concat:module_tests']);
	grunt.registerTask('build-external-js',  ['concat:external_scripts']);
	grunt.registerTask('build-inline-js',    ['concat:inline_scripts']);
	grunt.registerTask('build-external-css', ['less_imports:external',  'less:external']);
	grunt.registerTask('build-inline-css',   ['less_imports:inline',    'less:inline']);
	grunt.registerTask('lint-js',            ['jshint:module_tests', 'jshint:external', 'jshint:inline']);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Define the build pipes

	var devBuild = [
		 'build-sprites'
		,'build-external-css'
		,'build-inline-css'
		,'build-external-js'
		,'build-inline-js'
		,'build-module-tests'
		,'lint-js'
		,'watch'
	];

	var distBuild = [
		 'clean:dist'
		,'glue'
		,'concat:module_tests'
		,'concat:inline_scripts'
		,'concat:external_scripts'
		,'less_imports:inline'
		,'less_imports:external'
		,'less:inlineDist'
		,'less:externalDist'
		,'uglify:inline'
		,'uglify:external'
		,'lint-js'
		,'clean:temp'
	];

	var defaultTask = isDistBuild ? distBuild : devBuild;

	// If sprites building is not enabled in the app config, remove it.
	if (!cfg.get('enableSpritesBuilding')) {
		defaultTask = defaultTask.filter(function(task) {
			return (task !== 'build-sprites') && (task !== 'glue');
		});
	}

	grunt.registerTask('default', defaultTask);


	////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
	// Load grunt plugins

	// Base is set to xtcPath, all default xtc grunt plugins will be found on the next line
	loadGruntTasks(grunt, {pattern: ['grunt-*', 'assemble-less']});

	// Load all custom project grunt plugins
	grunt.file.setBase(base);
	loadGruntTasks(grunt, {config: path.join(cfg.get('appPath'), 'package.json')});

};
