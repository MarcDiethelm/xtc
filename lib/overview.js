/**
 * Project overview generation
 */

// I thought about rewriting this code OOP-style, but it just wasn't a good match.
// Functional programming works nicely here.

var  fs = require('fs')
	,path = require('path')
	,utils = require('./utils')
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
	modulePath = cfg.sources.modulesBaseDir;
	moduleFolderPrefix = cfg.moduleDirName.replace('{{name}}', '').replace('/', '');
	// Get dir info
	cfg.sources.views && (views = fs.readdirSync(cfg.sources.views));
	cfg.sources.layouts && (layouts = fs.readdirSync(cfg.sources.layouts));
	moduleCandidates = fs.readdirSync(modulePath);

	try { // if file exists
		pinnedViews = require(path.join(cfg.configPath, 'pinned-views.json'));
	} catch (e) {
		pinnedViews = []
	}

	return {
		 views  : views.filter(isUserView).map(file2ViewInfo).sort(sortPinnedViews)
		,layouts: layouts.filter(isUserLayout).map(file2LayoutInfo)
		,modules: moduleCandidates.filter(isModuleFolder).map(directory2Module)
	}
};

function isUserView(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.sources.views, fileName) ).isFile()
	;
}

function isUserLayout(fileName) {
	
	return (fileName.indexOf('_') === 0 ? false : true)
	       &&
	       fs.statSync( path.join(cfg.sources.layouts, fileName) ).isFile()
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

function isTemplateFile(fileName) {
	return fileName.indexOf(cfg.templateExtension) != -1;
}

function file2ViewInfo(file) {
	var name = file.replace(cfg.templateExtension, '')
		,pinnedIndex = pinnedViews.indexOf(name)
	;
	return {
		name: name
		,repoUri: repositoryUri(cfg.sources.views, file)
		,pinnedIndex: pinnedIndex
		,isPinned: pinnedIndex > -1
	}
}

function file2LayoutInfo(file) {
	return {
		name: file.replace(cfg.templateExtension, '')
		,repoUri: repositoryUri(cfg.sources.layouts, file)
	}
}

function file2Template(file, dir, modName) {
	return {
		name: file.replace(modName+'-', '').replace(cfg.templateExtension, '')
		,repoUri: repositoryUri(cfg.sources.modulesBaseDir + '/' + dir, file)
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
	return fs.readdirSync(path.join(cfg.sources.modulesBaseDir, dir)).filter(isTemplateFile).map(function(file) {
		return file2Template(file, dir, modName);
	});
}

function repositoryUri(dir, fileName) {
	return utils.getRepoWebViewUri(cfg.repoWebViewBaseUri, cfg.repositoryBranch, dir, fileName);
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
