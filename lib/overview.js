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
	,layouts
	,moduleCandidates
	,modules
	,pinnedViews
;


module.exports = function(appConfig) {
	cfg = appConfig;
	modulePath = cfg.paths.modulesBaseDir;
	moduleFolderPrefix = cfg.moduleDirName.replace('{{name}}', '').replace('/', '');
	views = fs.readdirSync(cfg.pathsAbsolute.views);
	layouts = fs.readdirSync(cfg.pathsAbsolute.layouts);
	moduleCandidates = fs.readdirSync(modulePath);
	pinnedViews = require(path.join(cfg.appPath, '_config', 'pinned-views.json'));

	return {
		 views  : views.filter(isUserView).map(file2ViewInfo).sort(sortPinnedViews)
		,layouts: layouts.filter(isUserLayout).map(file2LayoutInfo)
		,modules: moduleCandidates.filter(isModuleFolder).map(directory2Module)
	}
};

function isUserView(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.pathsAbsolute.views, fileName) ).isFile()
	;
}

function isUserLayout(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.pathsAbsolute.layouts, fileName) ).isFile()
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
	var name = file.replace('.hbs', '')
		,pinnedIndex = pinnedViews.indexOf(name)
	return {
		name: name
		,repoUri: repositoryUri(cfg.paths.views +'/'+ file)
		,pinnedIndex: pinnedViews.indexOf(name)
		,isPinned: pinnedIndex > -1
	}
}

function file2LayoutInfo(file) {
	return {
		name: file.replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.layouts +'/'+ file)
	}
}

function file2Template(file, dir, modName) {
	return {
		name: file.replace(modName+'-', '').replace('.hbs', '')
		,repoUri: repositoryUri(cfg.paths.modulesBaseDir + '/' + dir +'/'+ file)
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
	return cfg.repository ? (cfg.repository + path) : null;
}

function sortPinnedViews(a, b) {
	if (a.pinnedIndex !== -1 && b.pinnedIndex !== -1) {
		return a.pinnedIndex > b.pinnedIndex;
	}
	else if (a.pinnedIndex !== -1) {
		return false;
	}
	else if (b.pinnedIndex !== -1) {
		return true;
	}
}
