/*
 * grunt-glue-nu
 * https://github.com/MarcDiethelm/grunt-glue-nu
 *
 * Copyright (c) 2013 Marc Diethelm
 * Licensed under the MIT license.
 */

'use strict';

var  log = console.log
	,dir = console.dir
	,os = require('os')
	,path = require('path')
	,wrench = require('wrench')
;

module.exports = function (grunt) {

	// Glue options originally used with grunt-glue
	//'--css=<%=destSpritesCss%> --img=<%=destSpritesImg%> --less --url=<%=staticUriPrefix%><%=baseDirName%> --namespace=s --sprite-namespace= --recursive --crop --optipng --force --debug'

	var defaults = {
			 _process   : true
			,glueArgs   : null
			,tmpDir     : path.join(os.tmpdir(), 'grunt-glue-nu')
			,bundleName : null // default value set to task target inside the task

			,css        : null // default value set to dest inside the task
			,img        : null // default value set to dest inside the task
			,recursive  : true
			,crop       : true
			,force      : true
			,debug      : true
		}

		,extendedOptions = [
			 '_process'
			,'glueArgs'
			,'tmpDir'
			,'bundleName'
		]
	;

	// todo: need to write some tests (bdd?)
	// todo: look at/test conf files use

	grunt.registerMultiTask('glue', 'Create sprites automatically with Glue, but the grunt way!', function() {

		var  bundle = new Bundle()
			,done = this.async()
		;

		bundle
			.configure(this)
			.make()
			.compile(function compileCb() {
				bundle.clean();
				done(); // tell grunt this task:target is complete
			})
		;

		return true;
	});


	// Constructor

	var Bundle = function() {};

	Bundle.prototype = {

		taskTargetName: ''

		,taskData: {}

		,directToGlue: false

		,expandedSrc: []

		,options: {}

		,aGlueOptions: []

		,glueSrcDir: ''

		,isTmpDirCreated: false


		// controllers
		///////////////////////////

		,configure: function(taskTarget) {
			this.taskData = taskTarget.data;
			this.taskFilesSrcArray = taskTarget.filesSrc;
			this.taskData.options = this.taskData.options || {};
			this.directToGlue = !!this.taskData.options.glueArgs;
			this.taskTargetName = taskTarget.target;

			if (!this.directToGlue) {
				this.checkRequiredInput();
				this.options = this.mergeOptions(defaults, taskTarget);
			}
			return this;
		}

		,make: function() {
			var isSourceSimple = this.isSrcSimpleDir();

			if (!this.directToGlue) {
				// don't copy files if source is simple and bundleName is either not set or the same as task target name
				// why? because Glue has no way to specify the generated file names except through the source folder
				if ( isSourceSimple && (!this.options.bundleName || this.options.bundleName === this.taskTargetName) ) {
					// just pass the location to glue
					this.glueSrcDir = this.taskData.src;
				}
				else {
					// work with complex src (multiple sources, globbing) / copy to force bundle name
					this.glueSrcDir = this.copyFilesToTmpDir();
					this.isTmpDirCreated = true;
				}
			}
			return this;
		}

		,compile: function(compileCb) {
			if (!this.directToGlue) {
				// build the args to glue from options
				this.aGlueOptions = this.createGlueArgs(this.glueSrcDir, this.options);
			}
			else {
				this.aGlueOptions = this.taskData.options.glueArgs.split(' ');
			}

			this.runGlue(function runGlueCb(err, result) {

				if (err) {
					// Glue thinks it's terrible when the src is empty. We don't
					if (err.message.indexOf('No images found') !== -1) {
						grunt.log.warn(err.message.replace(/^Error: /, 'Glue: '));
					}
					else {
						grunt.fail.warn(err.message);
					}
				}

				grunt.log.debug(result.stdout);

				return compileCb();
			});
		}

		,clean: function() {
			// remove the tmpDir and any glueSrcDir it contains, must force because it's outside of working dir.
			this.isTmpDirCreated && grunt.file.delete(this.options.tmpDir, {force: true});
			return true;
		}


		// methods
		///////////////////////////

		,checkRequiredInput: function() {
			!this.taskData.src &&
				grunt.fail.fatal('No src specified.');

			!this.taskData.dest &&
				grunt.fail.fatal('No dest specified.');

			return true;
		}

		,mergeOptions: function(defaults, taskTarget) {
			var filesArray = taskTarget.files;
			// setting grunt task dest as default for css and img args, so they can be overridden with specific options.
			// Glue says: You must choose the output folder using either the output argument or both --img and --css.
			// So we're using --img and --css
			defaults.css = filesArray[0].orig.dest;
			defaults.img = filesArray[0].orig.dest;
			defaults.bundleName = taskTarget.target; // used as tmp dir name. glue uses that as sprite name

			// Merge task-specific and/or target-specific options with defaults.
			return taskTarget.options(defaults);
		}

		,isSrcSimpleDir: function() {
			var  taskDataSrc = this.taskData.src
				,src
			;
			if (typeof taskDataSrc === 'string') {
				src = taskDataSrc;
			}
			// is it an array consisting of one string?
			else if (grunt.util.kindOf(taskDataSrc) === 'array' && taskDataSrc.length === 1) {
				src = taskDataSrc[0];
			}

			if ( src && grunt.file.isDir(src) ) {
				return true;
			}
			else {
				return false;
			}
		}

		,copyFilesToTmpDir: function() {
			var bundleTmpDir = path.join(this.options.tmpDir, this.options.bundleName);

			// copy all files to a tmp folder for glue to work in
			this.taskFilesSrcArray.forEach(function eachSrcFile(file, index, array) {

				var basename = path.basename(file);

				// file
				if (!grunt.file.isDir(file)) {
					grunt.file.copy(file, path.join(bundleTmpDir, basename));
				}
				// folder
				else {
					this.copySubDir(file, bundleTmpDir, basename);
				}
			}, this);
			return bundleTmpDir;
		}

		,copySubDir: function(origDir, bundleTmpDir, subDir) {
			// create bundleTmpDir if needed
			if (!grunt.file.isDir(bundleTmpDir)) {
				grunt.file.mkdir(bundleTmpDir);
			}
			// copy the folder into bundleTmpDir
			wrench.copyDirSyncRecursive(origDir, path.join(bundleTmpDir, subDir), {
				forceDelete     : true,  // Whether to overwrite existing directory or not
				preserveFiles   : false, // If we're overwriting something and the file already exists, keep the existing
				inflateSymlinks : true   // Whether to follow symlinks or not when copying files
			});
		}

		,createGlueArgs: function() {
			var  arg
				,glueArgs = []
			;

			for (arg in this.options) {
				// don't push non-glue options into glue args
				if (extendedOptions.indexOf(arg) !== -1) {
					continue;
				}
				// don't push options that aren't set into glue args
				if (this.options[arg] === null) {
					continue;
				}

				if (typeof this.options[arg] === 'boolean') {
					// only add boolean option if value is true
					this.options[arg] === true && glueArgs.push('--'+ arg);
				}
				else {
					glueArgs.push('--'+ arg +'='+ this.options[arg]);
				}
			}

			glueArgs.push(this.glueSrcDir); // add the source dir last

			return glueArgs;
		}

		,runGlue: function(cb) {
			var options = {
				    cmd: 'glue'
					,args: this.aGlueOptions
				}
			;

			grunt.log.debug('> glue', this.aGlueOptions.join(' '));

			grunt.util.spawn(options, function(err, result, code) {
				cb(err, result)
			});
		}
	};

};



