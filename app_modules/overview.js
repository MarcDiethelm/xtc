/**
 * Project overview generation
 */

// I thought about rewriting this code OOP-style, but it just wasn't a good match.
// Functional programming works nicely here.

var wrench = require('wrench')
	,fs = require('fs')
	,path = require('path')
	,cfg
	,modulePath
	,moduleFolderPrefix
	,views
	,moduleCandidates
	,modules
;


module.exports = function(app) {
	cfg = app.config;
	modulePath = cfg.paths.module;
	moduleFolderPrefix = cfg.moduleDirName.replace('{{name}}', '').replace('/', '');
	views = wrench.readdirSyncRecursive(path.join(cfg.pathsAbsolute.templateBaseDir, cfg.viewsDirName));
	moduleCandidates = fs.readdirSync(modulePath);

	return {
		views: views.filter(isUserView).map(file2View)

		,modules: moduleFolderPrefix ?
			moduleCandidates.filter(isModuleFolder).map(directory2Module) :
			moduleCandidates.map(directory2Module)
	}
};

function isUserView(viewName) {
	return viewName.indexOf('_') === 0 ? false : true;
}

function isModuleFolder(folderName) {
	return folderName.indexOf(moduleFolderPrefix) === 0 ? true : false;
}

function isTemplateFile(fileName) {
	return fileName.indexOf('.hbs') != -1;
}

function file2View(file) {
	return {
		name: file.replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.views + file)
	}
}

function file2Template(file, dir, modName) {
	return {
		name: file.replace(modName+'-', '').replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.module + dir +'/'+ file)
	}
}

function directory2Module(dir) {
	var name = dir.replace(moduleFolderPrefix, '');
	return {
		name: name
		,repoUri: repositoryUri(modulePath + dir)
		,templates: getModuleTemplates(dir, name)
	};
}

function getModuleTemplates(dir, modName) {
	return fs.readdirSync(cfg.paths.module + dir).filter(isTemplateFile).map(function(file) {
		return file2Template(file, dir, modName);
	});
}

function repositoryUri(path) {
	return cfg.repository && (cfg.repository + path) || null;
}
