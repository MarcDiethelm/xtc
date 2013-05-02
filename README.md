# Node Terrific

This project brings the Terrific.js pattern to Node and Express. It provides a solid template for most web projects.
It implements some of the features of Terrific Composer, like server-side module includes.

## Features
- Light-weight and hackable JavaScript backend
- Can be used for single page apps.
- Server-side module includes.
- Handlebars templates.
- Modularization
- Flexible asset pipeline using Grunt.js // tbd: with sections for inlined, linked and on-demand assets.
- Automated testing

At risk:
- Grunt.js templates for efficient and consistent project and module creation.
- NPM packaging this project as a tool for super-easy project creation

## DOCS
naming convention:

- use - (hyphen for pretty much everything: module names, skins, template files)
- 'lib' is for any third-party code that we don't touch: libraries, jquery plugins

tbd:

- 000_base is for any module dependencies: utils, i18n, (connectors?)
- zzz_application is for any global code that depends on module availability: bootstrap

## todo

- docs: node setup & new project setup
- include prototyping/wireframe styles and a basic template using it. (similar to http://cs-cdw-proto.namics.com/)
- test automation
- module creation (wizard?)
- grunt: minification (and linting?)
- folder naming
- (npm publish: module-terrific.js?)
- auth info to config.js

- @import DONE
- bootstrap DONE
- file watcher DONE
- module include DONE
- js skins DONE

## What this does not
- shared logic to create correct state
- Dependency management
- Code and template re-use between browser and server.
- No client-side rendering is built in, so info below is out of context:
	- Initial rendering is done at the server, subsequent changes are rendered directly in the browser.
	- 'Ajax crawling' support: non-JS clients can get a semantically sensible representation of any page URI.
	- Handlebars templates precompilation
- Easy appcache manifest generation through Grunt
- database access from server and browser