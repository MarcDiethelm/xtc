# Node Terrific

This project brings the Terrific.js pattern to Node and Express. It provides a solid template for most web projects.
It implements some of the features of Terrific Composer, like server-side module includes.

## Features
- Light-weight and hackable JavaScript backend
- Can be used for single page apps.
- Server-side module includes.
- Handlebars templates.
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
naming convention:

- use - (hyphen for pretty much everything: module names, skins, template files)
- 'lib' is for any third-party code that we don't touch: libraries, jquery plugins

### Templates and views
In node-terrific the distinction between templates and views are as follows:

- Templates (`/templates`): Your basic document(s), typically a HTML document that contains all the things that are
always needed: HEAD, scripts, tracking and so on. Your template base template can be set in each route controller using
the layout property or disabled altogether with `layout: false`. A template that has a `{{{body}}}` variable will
include a
- View (`/frontend/views`): A view typically corresponds to an individual page with an URL. This is where you include
any modules specific to the page.

### Terrific Folder: Order matters
A simple but important concept is to understand how the default folders in /terrific are included. Any files you throw
in there are included and executed like so:

- `_inline` folder: Any style or JS sources in here are available in the files `inline.js` (todo: and `inline.css`).
This is a good place for basic bootstrapping code and dependencies like an asset loader or possibly some initial data
for use in a model. Use widely and sparingly.
- `base` folder: anything that needs to be defined before including any modules: LessCSS variables, mixins, grids,
some global JS code like Modernizr or other utilities and libraries and plugins.
- `mod-something` folders: All your module code and styles absically everything visible that's not pure layout.
- `_application` folder: The code that actually starts your app: Terrific bootstrap and any other global logic that
depends on modules being available. If you need to build themeing into your app, this is the place too.

## To Do

- docs: node setup & new project setup
- docs: building with grunt
- docs: config and dev/prod modes, templating: assets variable vs. env block helper
- use config.js for grunt paths
- Finalize a version that just provides Terrific support.
- Then focus on the advanced features
- look at Meteor.com
- include prototyping/wireframe styles and a basic template using it. (similar to http://cs-cdw-proto.namics.com/)
- template re-use / ajax crawling (Google AJAX Crawling Specification) / initial load
- shared logic to create correct state
- test automation
- dependency management
- currently all module templates are always inlined.
- app bootstrap
- module creation (wizard?)
- (npm publish: module-terrific.js?)
- auth info to config.js
- grunt: linting?
- inline css?
- documentation templates/placeholders (READMEs, plugins, libs, modules, etc.)
- grunt: develop mode and production mode
- handle appcache through grunt
- database access from server and browser

## Done

- grunt: minification DONE
- @import DONE
- Terrific bootstrap DONE
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