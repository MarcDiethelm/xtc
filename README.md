# Project Name

## Features
- Made with single page apps in mind
- Code and template re-use between browser and server.
- Initial rendering is done at the server, subsequent changes are rendered directly in the browser.
- 'Ajax crawling' support: non-JS clients can get a semantically sensible representation of any page URI.
- Modularization
- Dependency management
- Flexible asset pipeline using Grunt.js with sections for inlined, linked and on-demand assets.
- Automated testing
- Grunt.js templates for efficient and consistent project and module creation.
- database access from server and browser
- Easy appcache manifest generation

## DOCS
naming convention: use - (hyphen for pretty much everything: module names, skins, template files)
'lib' is for any third-party code that we don't touch: libraries, jquery plugins
000_base is for any module dependencies: utils, i18n, (connectors?)
zzz_application is for any global code that depends on module availability: bootstrap

## todo
- Finalize a version that just provides Terrific support.
- Then focus on the advanced features
- look at Meteor.com
- repository
- include prototyping/wireframe styles and a basic template using it. (similar to http://cs-cdw-proto.namics.com/)
- template re-use / ajax crawling (Google AJAX Crawling Specification) / initial load
- shared logic to create correct state
- test automation
- dependency management
- currently all module templates are always inlined.
- @import — todo: option to @import .css also. todo: publish
- bootstrap
- module creation (wizard?)
- grunt: minification (and linting?)
- grunt: develop mode and production mode
- handle appcache through grunt
- database access from server and browser
- file watcher DONE
- module include DONE
- js skins DONE

## Application life-cycle

- **Initial Load**
- Server: Match route to view
- Server: Render view **and state** (research needed!!), including modules and their content and inline assets partial
- Browser: Execute inline stuff
- (Define and fetch external (only?) dependencies)
- Browser: Load linked external assets (concatenated).
- Browser on DOM ready: start Terrific app and initialize modules.
- (?Browser: Modules load their dependencies?)
- **Initial Load Complete**
- Browser: State change through user interaction: Update location
- Browser: Render new view and/or (re-)render modules or update module state.
- Browser: Fetch unmet dependencies (either in view or modules)


# OLD

Ideally this project would tell you how to install node (Nave)

And then it you should be able to do npm install -g node-terrific (or node-composer?)
install grunt / grunt-init
After that you'd be able to execute `grunt-init node-composer` in your current folder
It would then create the whole setup:

- install dependencies
- -execute npm init
- create the basic files according to our really helpful pattern.
- set up the build tasks and testing
- and so on

---
For ease of use this project comes with an install script. It will get [Nave](https://github.com/isaacs/nave) a version
manager for Node.js from Github and install the latest stable Node.js version to .nave in your home folder. (No need for
sudo).

First make install.sh executable using a terminal with

	chmod +x install.sh

then start it

	./install.sh