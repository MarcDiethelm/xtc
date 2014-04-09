#!/usr/bin/env node

// Must symlink the generator from xtc's modules up to the project's modules.
// Else Yeoman won't find it.

var path = require('path')
	fs = require('fs')
;

// process.cwd() == __dirname

if ('install' === process.env.npm_lifecycle_event) {

	try {
		fs.symlinkSync(path.join(process.cwd(), '/node_modules/generator-xtc'), path.join(process.cwd(), '../generator-xtc'), 'dir');
		console.log('symlink: generator-xtc into node_modules\n')
	} catch (e) {
		if (e.code === 'EEXIST') {
			console.info('symlink: generator-xtc already exists in node_modules\n');
		}
		else {
			throw e;
		}
	}

}

// And of course we remove it again before xtc is uninstalled

else if ('uninstall' === process.env.npm_lifecycle_event) {

	try {
		fs.unlinkSync(path.join(process.cwd(), '../generator-xtc'), 'dir');
		console.log('symlink: removed generator-xtc from node_modules\n')
	} catch (e) {
		if (e.code !== 'ENOENT') {
			console.info('symlink: Unable to remove generator-xtc from node_modules\n');
		}
		throw e;
	}
}