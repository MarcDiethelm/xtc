#!/usr/bin/env node

// Must symlink the generator from xtc's modules up to the project's modules.
// Else Yeoman won't find it.

var path = require('path')
	,fs = require('fs')
	,util = require('util')
	,cwd = process.cwd()
	,src = path.join(cwd, '/node_modules/generator-xtc')
	,dest = path.resolve(cwd, '../generator-xtc')
	,linkVerb = 'win32' === process.platform  ? 'junction' : 'symlink'
;

if ('install' === process.env.npm_lifecycle_event) {

	try {
		fs.symlinkSync(src, dest, 'junction'); // junction: used on windows instead of symlink (where symlinks need admin permissions)
		console.log(util.format('%s: generator-xtc into node_modules\n', linkVerb));
	} catch (e) {
		if ('EEXIST' === e.code) {
			console.info(util.format('%s: generator-xtc already exists in node_modules\n', linkVerb));
		}
		else if ('EPERM' === e.code) {
			throw new Error(util.format('permission error: creating %s to generator-xtc\n%s --> %s\n', linkVerb, src, dest));
		}
		else {
			throw e;
		}
	}
}

// And of course we remove it again before xtc is uninstalled

else if ('uninstall' === process.env.npm_lifecycle_event) {

	try {
		fs.unlinkSync(dest);
		console.log(util.format('%s: removed generator-xtc from node_modules\n', linkVerb));
	} catch (e) {
		if ('ENOENT' === e.code) {
			console.info(util.format('%s: remove failed, generator-xtc not found in node_modules\n', linkVerb));
		}
		else {
			e.message = util.format('%s: unable to remove generator-xtc from node_modules\n', linkVerb) + e.message;
			throw e;
		}
	}
}