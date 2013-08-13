
# 0.7.0 / develop

xxxx-xx-xx

 - Add option to allow bypassing auth for configurable IP ranges.
 - Renamed app_modules to lib.
 - Move routes.js from lib to controllers.
 - Test grunt tasks: build-external-js, build-external-css, tests now contained in subdirs
 - Replace Underscore.js with Lo-Dash. Eliminates need for utils.deepExtend.

# 0.6.2

2013-xx-xx

 - remove initial-scale=1.0 from viewport meta, see https://github.com/h5bp/html5-boilerplate/issues/824 (todo: cherrypick)

# 0.6.1

2013-08-11

 - Fix path to sprite file.
 - Fix #41: Catchall route not handling some non-existing resources
 - README now contains links to mentioned tools
 - Log node version on startup.
 - Give meaningful error when required auth user is not defined.

# 0.6.0

2013-08-08

 - Start semver versioning the project, there are actual users now.
 - 0.6.0 because we have a good code base and powerful features, but I want some space for breaking changes before 1.0.0