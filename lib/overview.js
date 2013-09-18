/**
 * Project overview generation
 */

// I thought about rewriting this code OOP-style, but it just wasn't a good match.
// Functional programming works nicely here.

var  fs = require('fs')
	,path = require('path')
	,cfg
	,modulePath
	,moduleFolderPrefix
	,views
	,templates
	,moduleCandidates
	,modules
;


module.exports = function(appConfig) {
	cfg = appConfig;
	modulePath = cfg.paths.modulesBaseDir;
	moduleFolderPrefix = cfg.moduleDirName.replace('{{name}}', '').replace('/', '');
	views = fs.readdirSync(cfg.pathsAbsolute.views);
	templates = fs.readdirSync(cfg.pathsAbsolute.templates);
	moduleCandidates = fs.readdirSync(modulePath);

	return {
		 views: views.filter(isUserView).map(file2ViewInfo)
		,templates: templates.filter(isUserTemplate).map(file2TemplateInfo)
		,modules: moduleCandidates.filter(isModuleFolder).map(directory2Module)
	}
};

function isUserView(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.pathsAbsolute.views, fileName) ).isFile()
	;
}

function isUserTemplate(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.pathsAbsolute.templates, fileName) ).isFile()
	;
}

function isModuleFolder(folderName) {
	if (moduleFolderPrefix) {
		return folderName.indexOf(moduleFolderPrefix) === 0 ? true : false;
	}
	else {
		// If we don't have a prefix to look for eliminate all results beginning with a period.
		return folderName.indexOf('.') === 0 ? false : true;
	}
}

function isHbsFile(fileName) {
	return fileName.indexOf('.hbs') != -1;
}

function file2ViewInfo(file) {
	return {
		name: file.replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.views +'/'+ file)
	}
}

function file2TemplateInfo(file) {
	return {
		name: file.replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.templates +'/'+ file)
	}
}

function file2Template(file, dir, modName) {
	return {
		name: file.replace(modName+'-', '').replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.modulesBaseDir + dir +'/'+ file)
	}
}

function directory2Module(dir) {
	var name = dir.replace(moduleFolderPrefix, '');
	return {
		name: name
		,repoUri: repositoryUri(modulePath +'/'+ dir)
		,templates: getModuleTemplates(dir, name)
	};
}

function getModuleTemplates(dir, modName) {
	return fs.readdirSync(path.join(cfg.paths.modulesBaseDir, dir)).filter(isHbsFile).map(function(file) {
		return file2Template(file, dir, modName);
	});
}

function repositoryUri(path) {
	return cfg.repository && (cfg.repository + path) || null;
}
