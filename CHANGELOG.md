# Changelog

## develop branch (0.9.0)

## 0.8.0
### Upgrading to 0.8.0
- `npm rm -g generator-xtc`

## 0.8.0-beta8 — 2014-06-11
- Fix error handling for generator-xtc symlink removal.
- Moved app views from project to new xtc `views` dir. Patched Express to search multiple views dirs.
- Moved xtc app routes from project to xtc controllers.
- xtc app routes are now mounted at `/xtc`.
- You can specify the port that xtc listens to by calling `xtc start` with `-p [number]` or `--port [number]`.
- Grid demo now shows actual grid setup variables at the top.
- You can now specify your own template file or folder to create modules from. All files are processed as Lo-Dash templates. Just changing the extension of the default template still works.
- Colored console output in development
- Control the server from server.js in the project.
- Fix registration of user-defined Handlebars helpers.
- Moved the Handlebars helper Hipsum.js to project dependencies.
- The Handlebars instance is passed to project. Project template helpers are now registered at the project level instead of in the xtc module.
- Added a new project-level helpers module to add new or override default helper functions at `app.xtc.helpers`.
- Ability to add custom grunt plugins at project level.
- Don't send detailed error messages to clients in production mode.
- Changed names of frontend subfolders (removing underscores, adding underscore to `views`).
- Changed `_config` folder to `config`.
- `xtc setup` creates an [`.editorconfig`](http://editorconfig.org/) file.
- Update such.less. Includes newest iteration of responsive grid, now re-named Spartan.
- Adds easy CSRF support.

## 0.8.0-beta7
- xtc-generator is now part of the xtc package and can be run from the project folder.
- Moved `_config`, `frontend` and `controllers` folders to the generator.
- Small improvements and fixes
- Project generator creates a .xtcrc file to save your choices for the next run (or update).
- Moved location of terrific-extensions.js from frontend/application/js to frontend/base/js

## 0.8.0-beta6
- xtc can be installed as a node module inside a project.
- Moved all devDependencies except Mocha to dependencies.
- Removed node_modules from xtc repository
- Move all dependencies to fixed versions and update some dependencies.
- Breaking: To get links to web view of sources in the repository, just supply the repository's https git URI.
- Bugfixes: Create correct app paths on Windows
- Bugfix: Correct repository URLs in project overview if sources are outside xtc root folder.
- xtc now prints a nice error message if the server port is already in use.
- Removed support for Node v0.8

## 0.8.0-beta5
- Bugfix: Update grunt-glue-nu 0.1.0 --> 0.3.0
- Bugfix: Moving config out of xtc folder now works.
- Make `pinned-views.json` optional.
- Module calls now accept `classes` instead of `htmlClasses`. But `htmlClasses` still works.
- Update less 1.5.0 --> v1.6.3 / assemble-less 0.7.0.
- LessCss `import reference` is not supported anymore.
- Experimental & basic CSS source maps support. View `.less` source files in browsers that support it (e.g. Chrome).

## 0.8.0-beta4
- This release contains breaking changes.
- Fix some path issues when calling generator-xtc from outside xtc.
- Rename the static base var in LessCSS @static-prefix —> @static-base
- The template extension is configurable. generator-xtc will use this value when creating template files.
- Finally created a new Readme and renamed the existing file documentation.md
- Include/update such.less CSS framework (will be optional in the future).
- Wrap grunt and generator xtc with `npm run build`, `npm run build-dist`, `npm run mkmod` and `npm run mkskin`. This is now the default way to run these tools.

## 0.8.0-beta3
- This release contains breaking changes.
- Additional config / build rewrite, allows complete flexibility for frontend sources and build destinations, even outside of xtc root. All relative paths are resolved to absolute paths.
- xtc can now be used as a Terrific build tool in foreign frameworks that do their own module includes.

## 0.8.0-beta2
- Fix missing dependencies that resulted from gitignoring too aggressively.

## 0.8.0-beta1
- This release contains breaking changes.
- Use Hipsum.js for easy filler text. Available in development and production installations.
- Use grunt-glue-nu for improved glue spriting the grunt way
- Full logging in production, including date and user agent.
- Templating: Ability to inject specfic objects from the surrounding context into a module call.
	`{{mod "filter" data=someObject}}` The properties of `someObject` are now available in top level of the module context.
	So now you can call a module template multiple times with different (but uniform) data. Previously this only worked
	with literals.
- Gruntfile watches itself for changes, initiates a default build when changed.
- Handlebars helpers are now automatically registered for use in module templates.
- Views in the project overview are now rendered using the catch-all route. This prevents conflicts with with ‘raw’ & ‘solo’ `_view` routes if the dev adds custom routes to the views that include queries.
- "Pin" views to the top in the project overview by writing view names in a json file in _config/.
- Default asset build now writes into `build` dir (not tracked by git) and does not minify anymore. Start grunt with `--dist` option to start a production build, including minification, into `dist` dir (tracked by git).
- Improved formatting of rendered modules. Auto-indent nested modules. You can manually specify the desired indentation on module and inline asset calls.
- Refactored a lot of application code for clarity and better separation of components.
- Using [node-convict](https://github.com/mozilla/node-convict) for configuration building and switched to [CJSON](https://github.com/kof/node-cjson) config files. Convict supports environment variables and validation of config values.
- The location of the config files can now be configured in package.json.
- Base templates are now referred to as *layouts*, in line with Express terminology. The folder name is changed from `frontend/views/templates` to `frontend/views/layouts`.
- `config-local.js` is now ignored when running in production mode.
- node_modules are now tracked in the repository

## 0.7.9 — 2013-12-03
- Fix repo link for module templates in project overview.

## 0.7.8 — 2013-11-26
- Fix: After one request with authorized IP, auth was permanently disabled because authNeeded boolean was stored in
	parent scope.

## 0.7.7 — 2013-11-14
- Fixed missing dependency to utils.error if inline assets file is not found.
- Better error messages if assets are not found.

## 0.7.6 — 2013-10-28
- Data injected on module call changed context upstream for following calls.
- If static URI prefix was not an empty string it was followed by a double slash in generated CSS.
- If static URI prefix was not an empty string there was no leading slash in rendered HTML.
- When there's a module rendering problem, present a more useful error than the Handlebars default.

## 0.7.5 — 2013-10-20
- Make Handlebars helpers available in Terrific modules.
- Refactored Handlebars helpers to a separate node module.
- Add `log` Handlebars helper, delegating to `console.log`.
- Improved sprites helper selector.

## 0.7.4 — 2013-10-11
- Automatically serve favicon.ico from public folder.
- Load jQuery before inline JS.
- Force Glue to always build sprites when sprite task runs. Get output from Glue if there were errors.

## 0.7.3 — 2013-10-07
- Don't fail when rendering empty module. (With express3-handlebars we can now render empty templates without Handlebars complaining.)

## 0.7.2 — 2013-10-01
- Connector attributes are handled as regular attributes since 0.7.0. Update and clean up tests, documentation and example.
- Show connectors on test output, this results in correct grouping.
- Make sure we don't test modules with identical options multiple times.
- Adds missing sprites helper rule/file, presetting all sprites to inline-block.

## 0.7.1 — 2013-09-25
- Empty accidentally committed config-project.js, it was enabling sprites building which should be off by default.
- Fix asset paths for Windows.


## 0.7.0 — 2013-09-18
- Add option to allow bypassing auth for configurable IP ranges.
- Renamed app_modules to lib.
- Move routes.js from lib to controllers.
- Test grunt tasks: build-external-js, build-external-css, tests now contained in subdirs
- Replace Underscore.js with Lo-Dash. Eliminates need for utils.deepExtend.
- Set any attribute on the Terrific module wrapper.
- Ready to deploy to Heroku using Strongloop.
- Change skins directory name from 'skin' to 'skins'. Can be changed in config.
- Module tests for the current page run in the browser.
- Less files in `reference` folders are included with @import (reference): Only imports what is actually used.

## 0.6.3 — 2013-09-17
- Fix: Nesting of modules was broken.

## 0.6.2 — 2013-09-06
- Remove initial-scale=1.0 from viewport meta, see https://github.com/h5bp/html5-boilerplate/issues/824
- Fix static URI prefix for LessCSS.

## 0.6.1 — 2013-08-11
- Fix path to sprite file.
- Fix #41: Catchall route not handling some non-existing resources
- README now contains links to mentioned tools
- Log node version on startup.
- Give meaningful error when required auth user is not defined.

## 0.6.0 — 2013-08-08
- Start semver versioning the project, there are actual users now.
- 0.6.0 because we have a good code base and powerful features, but I want some space for breaking changes before 1.0.0
