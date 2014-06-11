## Table of Contents


- [Installing Prerequisites](#installing-prerequisites)
	- [Node.js](#nodejs)
	- [Install xtc Dependencies](#install-xtc-dependencies)
	- [Optional: Sprites](#optional-sprites)
- [Project Setup](#project-setup)
	- [Configuration](#configuration)
	- [Start the Server!](#asset-building-grunt)
	- [WebStorm / PHPStorm Users](#webstorm--phpstorm-users)
- [Manual](#manual)
	- [Naming Convention](#naming-convention)
	- [Routing and Rendering](#routing-and-rendering)
	- [Layouts and Views](#layouts-and-views)
	- [Handlebars Helpers](#handlebars-helpers)
	- [Frontend Folder: Order matters](#frontend-folder-order-matters)
	- [Terrific Modules](#terrific-modules)
	- [Module Creation](#module-creation)
	- [Module Testing](#module-testing)
	- [Asset Building: Grunt](#asset-building-grunt)
	- [Static Assets](#static-assets)
		- [LessCSS 1.6.0](#lesscss-160)
	- [Development and Production Mode](#development-and-production-mode)
	- [Building Sprites with Glue](#building-sprites-with-glue)
	- [Build Customization](#build-customization)
	- [Deploying](#deploying)
- [Template Development and Integration Into Other Backends](#template-development-and-integration-into-other-backends)
	- [Project Overview](#project-overview)
- [Basic Authentication and Bypass for IP Ranges](#basic-authentication-and-bypass-for-ip-ranges)
- [Framework Testing](#framework-testing)
- [Differences to Terrific Composer](#differences-to-terrific-composer)
- [What xtc does not do (yet)](#what-xtc-does-not-do-yet)
- [Contributing](#contributing)


## Installing Prerequisites


Like any framework xtc depends on some other software to run. Installing the dependencies is easy and quick however.
And your next project will be able to the same functionality out of the box.


### Node.js

Install node using a node version manager. Or download the Node.js [installer](http://nodejs.org/).

> It is recommended that you use a Node version manager so you can switch between node versions effortlessly. Eventually you'll have multiple Node projects, possibly depending on different versions of Node.js. I recommend using [n](https://github.com/visionmedia/n). Just clone/download it and `make install`. Oh, and before you do make sure `/usr/local` and its descendants are writable by you. If you're on a Mac, [brew](http://brew.sh/) takes care of that. After that no more `sudo`.

Strictly speaking you don't NEED a node version manager. Downloading the installer from the Node.js website will work
just fine. If you're on Windows it's what you do.

#### Windows users

<small>
I highly recommend you use [Git Bash](https://openhatch.org/missions/windows-setup/install-git-bash) as your command
line. The Windows cmd.exe is just too limited to be useful. Among other things you'll experience problems
installing git dependencies with npm and Node version managers do not work in the cmd.
</small>


### Install xtc Dependencies

With the Node installation comes [NPM](https://npmjs.org/) the awesome [node package manager](https://npmjs.org/doc/cli/npm.html).
We'll use it to first install some command line tools that need to be installed globally:

```shell
npm install -g xtc-cli yo grunt-cli
```

#### Optional: Sprites

If you want to use the automatic sprites generation you need to also install Glue and OptiPNG.

First make sure you have an up to date Python installation. Refer to the section "Properly Install Python" for your
platform, [from the official guide](http://docs.python-guide.org/en/latest/index.html). Mostly you need Homebrew and Pip.
After that, [install Glue](http://glue.readthedocs.org/en/latest/installation.html). You need version 0.9 or higher.

It worked if you can `glue -v` to get the installed version.


## Project Setup

In the terminal, change to the project folder and start the xtc install and project generator: `xtc install`. Once you have answered some questions xtc is installed as a local node module and the basic project files including a package.json are created.


### Configuration

Your package.json contains the property `configPath` which holds the location of the configuration. The default folder is `_config`. xtc's configuration consists of multiple files whose properties are merged to create the runtime configuration. On top of this, some config properties may be set using environment variables and command-line arguments.

The load order of the config files is set in configs.json.

- `config-default.js` defines defaults, CLI args and env vars for all configurable properties. You should not normally have to edit it. Copy properties to the following files to override the default value.
- **`config-build.json`** serves to configure build source and output location, static URLs and so on.
- **`config-server.json`** is where you configure properties related to the server.
- `config-secret.json` for local development with [basic auth](#basic-authentication-and-bypass-for-ip-ranges) credentials, db authentication info, SSL certs and so on. For deployments you should use env vars to hold your secrets!
- `config-local.json` serves to override configuration values only for development on your local machine.

`config-secret.json` and `config-local.json` are listed in `.gitignore` and won't be committed to your repository.
`config-local.json` is also listed in `.jitsuignore`, so if you're using Nodejitsu for hosting this file will never be deployed. Make sure these two files are not tracked by git unless you know what you're doing.

xtc uses [CJSON](https://github.com/kof/node-cjson) for the config files, which allows comments.


### Start the Server!

In a terminal change to the project folder and start the server with `xtc start`. xtc will load its configuration and start listening on the configured port. Now you can visit `localhost:3000` (if you haven't changed the default port) in a browser. That's it. You can start building websites now!


#### WebStorm / PHPStorm Users

There are some things you can do that will make development so much more easy:

- You can [run Node directly in your IDE](http://www.jetbrains.com/webstorm/webhelp/node-js.html). Make sure the Node.js plugin is installed and then create a 'Run' configuration (or multiple) pointing to app.js. Set your environment variables as needed.
- In WS 7 use the new terminal window to run **Grunt** (and npm) directly in the IDE. Any errors during asset parsing will be immediately be visible to you. Just make sure you have installed Grunt CLI globally with `npm install -g grunt-cli`. In PHPStorm you'll also need to install the terminal window plugin.
- Use the Handlebars/Mustache plugin (included in WS 7). It will give you code insight and syntax highlighting for .hbs files. I also recommend setting the commenting style to Handlebars comments once you have the plugin.
- Allow comments in CJSON config files. In the IDE preferences search for "validate json" and select "Inspections" in the sidebar, then click on the text "Validate JSON" in the tree. Disable the "Warn about comments in JSON" checkbox in the sub-options.


## Manual


### Naming Convention

- use - (hyphen) for pretty much everything: module names, skins, template files
- 'lib' folders are for any third-party code that we don't touch: libraries, jquery plugins. Use unminified files.
- Files that start with an underscore are resources required for xtc's functionality.


## Server

[Express 3](https://github.com/visionmedia/express) is the server application used in xtc. It is very powerful and I recommend reading through its [guide](http://expressjs.com/guide.html) and [API](http://expressjs.com/api.html).
If you installed xtc with the server component, you can control configure its functionality in `server.js`. In this file the server middlewares are set up and the [server object](http://nodejs.org/api/http.html#http_http_createserver_requestlistener) is exposed if you need it. A middleware in Express is just a callback in a stack that is executed on each request. A minimal middleware looks like this:

```js
function fooWare(req, res, next) {
	// do some server stuff with the request and response here
	next(); // call next middleware
}

// Add it to the end of the stack
app.use(fooWare);
```
[Understanding Express 3 ⇗](http://evanhahn.com/understanding-express-3/)

### Routing and Rendering

Below some are very basic examples. For more advanced stuff check out the files in the `controllers` folder and make sure you look at Express' documentation linked above.

In xtc the server routes are defined in `controllers/routes.js`. [Editing routes is very straightforward](http://expressjs.com/api.html#app.VERB).

Basically every route has at least one assigned callback.

```js
app.get('/', index.home);
```

The callback gets three arguments: `req` (request object), `res` (response object), `next` (the next 'middleware'). Pretty much everything you need is contained in the first two. Route callbacks or *controllers* are defined in `controllers/index.js`. The most basic callback looks like this:

 ```js
 index.home: function(req, res, next) {
    res.render('home');
 }
 ```

This will render the 'home' view (home.hbs) in the default base document. In Express a base document is called a *layout*. Here's a slightly more advanced example of a render call:

```js
res.render('subpage', {
	 layout: 'alternate'
	,title: 'Subpage'
});
```

This will render the view called 'subpage' inside the layout defined in the file alternate.hbs. The second argument to `res.render` contains instructions (like `layout`) and data for the rendering engine. The `title` property is an example of such data. It is available in the view and layout templates as the `{{title}}` variable.

### Layouts and Views

In xtc the distinction between views and layouts is as follows:

- View (`frontend/views`): A view typically corresponds to an individual page with an URL. This is where you include any modules specific to the page.
- Layouts (`frontend/views/layouts`): Your basic document(s), typically a HTML document that contains all the things that are always needed: HEAD, scripts, tracking and so on. The desired layout can be defined in each route controller using the `layout` property or disabled altogether with `layout: false`. The view is added to a layout template with the `{{{body}}}` variable.

#### Handlebars Helpers

You can add your own Handlebars helper functions in addition to some existing helpers. Check out
`lib/handlebars-helpers.js` for examples and to add your own. And take a look at http://handlebarsjs.com/#helpers for more info about
 Handlebars helpers.

xtc install [Hipsum.js](https://github.com/MarcDiethelm/Hipsum.js) to your project so you can quickly generate filler text in your templates. Check out the documentation in the link if needed.


### Frontend Folder: Order matters

A simple but important concept is to understand how the files and folders in `/frontend` are included.

- `_inline` folder: Any style or JS sources in here are available in the files `inline.js` and `inline.css`.
This is a good place for basic bootstrapping code and dependencies like an asset loader or possibly some initial data
for use in a model. Use wisely and sparingly.
- `_base` folder: Anything that needs to be defined before including any modules: LessCSS variables, mixins, grids,
some global JS code like Modernizr or other utilities and libraries and plugins. You can use [Less' @import (reference)](#lesscss-150)
- `modules/moduleName` folders: All your module code and styles, basically everything visible that's not pure layout.
- `_application` folder: The code that actually starts your app: Terrific bootstrap and any other global logic that
depends on modules being available. If you need to build themeing into your app, this is the place too.
- `public` folder: Static resources that need to be available to the world go here, including the generated assets.

All these resources [are available to your templates](#static-assets) will be concatenated and minified (except the static stuff of course).


### Terrific Modules

Terrific modules can consist of Handlebars templates, LessCSS styles and a Terrific JS module.
Additionally you may use 'skins' to 'decorate' the main definitions of the module. Skins consist of LessCSS and JS files
inside a `skins` folder.

To include a module in a view or other module template use this syntax:

```Handlebars
{{mod "example"}}
```

A module's markup by default is wrapped in a generated SECTION tag, that at the minimum looks like this:

```html
<section class="mod mod-modulename"></section>
```

The HTML classes on the wrapper serve as 'binding sites' for the module's logic and styling.

A module include with all available options configured looks like this:

```Handlebars
{{mod "example" template="alternate" skins="alternate, baz" tag="article" id="foo" classes="test-class" data-connectors="stats, filter" data="{var1: 'foo'}"}}
```

This will generate the following wrapper:

```html
<article class="mod mod-example test-class skin-example-alternate skin-example-baz" id="foo" connectors="stats, filter"></article>
```

Please refer to the official docs at [Terrifically.org](http://terrifically.org/) to learn more about the Terrific
pattern. You may safely ignore the part about "Composer" though.

You can use the `data` attribute on a module include to **inject data** (as a JS object or object literal) into the context of the
module template.

You can set any attribute on the module wrapper you want. Attributes not mentioned so far in this section will simply be added to the
markup. This includes HTML5 `data-` attributes.

You can enable **annotations** in the HTML output around modules in the config. The annotation displays the module name,
the template file name, the filesystem path and repository URL to the module.

the **indentation** of included modules can be controlled with the `indent` attribute using integer values. Nested child modules are indented automatically.

Using the `noWrapper=true` attribute on a module include will prevent creation of the wrapper element and module annotation.
This is useful when creating markup-only modules in base layouts, e.g a HTML HEAD module including the doctype. You can
think of it like using **a partial but using modules** instead of yet another mechanism.


#### Module Creation

To create new Terrific modules there's a convenient [Yeoman](http://yeoman.io/index.html) generator.

To create a new module simply type

```Shell
xtc mkmod
```

in the project root folder. You'll be asked to choose a module name.


##### Skin Creation

Terrific modules can be extended or 'decorated' with JS or CSS [skins](http://terrifically.org/api/skin/).
To create a new module skin type

```Shell
xtc mkskin
```

in the project root folder. You'll be asked to choose a module to create the skin for.

Note: `npm run xyz` is wrapper command defined in package.json.


#### Module Testing

You can write client-side tests with [QUnit](http://qunitjs.com/) for your Terrific modules. When your working on a page
on each refresh every module contained in the page has its tests run and the results printed to the console. This is
very useful to immediately see if something breaks during development.

To disable module testing set `enableModuleTesting` to false in the config.<br>
To use the classic QUnit display in the page set `QUnitFE.showUi` to true.<br>
QUnit adds a symbol to the HTML title indicating the test status. To disable set `QUnitFE.alterTitle` to false.


### Asset Building: Grunt

After editing your frontend styles and scripts you need to re-generate the assets for the frontend. You have already installed grunt-cli globally. Now in your project enter `xtc build`. That's it.
[Grunt](http://gruntjs.com/getting-started) will build your assets and also watch all your JS and Less/CSS source files
as configured in [Gruntfile.js](http://gruntjs.com/sample-gruntfile). When you edit them it re-generates the assets
automatically. You will have to restart Grunt for it to register
[any files in new folders](https://github.com/gruntjs/grunt-contrib-watch/issues/70) though!

**Note:** The generated assets are written to `frontend/public/build` which is ignored by git. Every developer on a development team must be able to create the assets on the fly. Committing the files would produce tedious merge conflicts after every pull.

Start grunt with `xtc build --dist` to create minified production assets in `frontend/public/dist`. Then commit them. After that you're go for deployment.


### Static Assets

If you look at config.js you will find that you can define the file system locations of your assets very flexibly.
This allows you to model file structures to your liking or to the requirements of a particular backend where your code
might need to be integrated.

The URIs to your static assets are all available under the `static` variable in your templates:

```js
// prefixes
static.base // The base URI to the static assets
static.img // The base URI to your images
// full URIs
static.build.js.external // The URI to the generated main JS file
static.build.css.external // The URI to the generated main CSS file
```

The static base URI is available in your LessCSS files as the variable

```less
@static-base
```

You should always use a slash after a base variable.

```Handlebars
<script src="{{static.base}}/lib/jquery-1.10.2.js"></script>
```

```less
background-image: url("@{static-base}/img/bg.png");
```

Inline assets are available through a template helper, like so

```Handlebars
{{inline "js"}}
{{inline "css" indent=2}}
```

Note that you can control the indentation with the `indent` attribute. The chars used for indenting can be changed with the config property `indentString`.

If you run the server in **production mode** the minified versions of these assets will be used.  

#### LessCSS 1.6.0

~~Less files in `reference` folders (in `inline` and `base`) are included with Less 1.6.0's `@import (reference)`:
Only mixins and variables that are actually used are imported. This is great for libraries of helper and mixins or UI
frameworks like Bootstrap.~~ This is not currently working.


### Development and Production Mode

Express determines which mode to use through an system environment variable `NODE_ENV` which either has the value `development`
or `production`. Generally speaking in dev mode resources aren't cached so that any changes that are made in the
frontend can be picked up. Also, in dev mode non-minified asset versions are used for easier debugging.

You can conditionally render markup using the environment block helper...

```Handlebars
{{#env "production"}}<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>{{/env}}
{{#env "development"}}<script src="{{static.base}}/lib/jquery-1.10.1.js"></script>{{/env}}
```


### Building Sprites with Glue

xtc allows you to automate the generation of sprite sheets and their associated styles. This functionality depends on
the powerful [Glue](https://github.com/jorgebastida/glue) command line tool written in Python. Because of that sprites
building is not enabled by default. To enable it you need to [install Glue on your system](#optional-sprites) first
and set a pref in the config like this: `enableSpritesBuilding: true`

The standard location for your sprites is in `frontend/base/css/sprites`. If you have sprites that are unique to a
module you can put them in a `sprites` folder inside the module.

xtc uses [grunt-glue-nu](https://github.com/MarcDiethelm/grunt-glue-nu) to execute and enhance Glue. If you edit the
Gruntfile.js you have almost total freedom to build your sprite bundles exactly as you want them.


### Build Customization

If you need more flexibility or a different feature, you can edit the `Gruntfile.js` where the build tasks are defined.
With [Grunt](#asset-building-grunt) there's almost no limit to what you can do. Grunt plugins installed in your project will be registered with Grunt [automatically](https://github.com/sindresorhus/load-grunt-tasks) as long as their name starts with `grunt-`.


### Deploying

TODO documentation


## Frontend Development and Integration Into Other Backends

There are two ways that xtc supports working with other backends.

- xtc as server (production or just templating)
- xtc as frontend building environment in a different server

### xtc as server (production or just templating)

xtc implements some features to help with template integration into different backend systems.

- Project overview
- Rendering single modules, with API
- Module annotation

#### Project overview

`/xtc` displays an overview of all user-defined views, modules and layouts, i.e. ones whose names don't start with an underscore. The page contains links to the views and modules at `/[view name]`, `/xtc/module/[module name]` and
`/xtc/layout/[layout name]` respectively. If you add the parameter `raw` to the URI, you get the pure HTML of that
resource without any surrounding markup, e.g:

	/view-name?raw
	/xtc/module/module-name?raw
	/xtc/layout/layout-name?raw

Adding the parameter `solo` to a view request, will skip any modules that have the attribute `isLayout="true"` on their
include tag. E.g.

	/view/example?solo

**Views can be pinned** to the top of the list by adding their name to an array in the file `_config/pinned-views.json`.
The pinned views will be presented in the order they appear in the file. The file is optional.

### xtc as Terrific build and frontend tool

xtc is the ideal environment for frontend development in other backends. All the backend has to implement is module includes to satisfy the Terrific pattern. The rest is handled by xtc in a manner that is intimately known to a frontend developer who has worked with xtc before: build tool, generators, familiar and flat file structure, reliable less parsing and many other tools that are part of xtc.

Instead of re-inventing the wheel in other backends and building disparate solutions to try to enable frontend building, which always fall short, you can use xtc as a standardized environment made for frontend development. xtc is completely configurable when it comes to specifying the sources and build output locations.

xtc can be set up as build tool by either a frontend or a backend dev. Install xtc and choose a build-only setup, if needed edit the JSON config and .gitignore, start a build. It just works.

Note that some files and directories need to be in the same directory:

- package.json
- node_modules
- Gruntfile.js

The dev build dir should be listed in a .gitignore.

## Basic Authentication and Bypass for IP Ranges

Password protecting content couldn't be easier. To restrict access you add BasicAuth to the route that accesses the
sensitive resource.

```js
app.get('/data/:someParam', app.authBasic('user'), index.data);
```

Just insert the authentication middleware as shown in the snippet above. The argument to `app.authBasic` is the required
username. The username/password combination(s) should be set using the environment variable `AUTH_BASIC`. For instructions see `config/config-secret.js`.

You can open the restricted routes to certain IP ranges if you so desire. For security reasons you need to enable this
feature by adding the property `allowAuthBypassForIpRanges: true` in `_config/config-project.js`.

Set the environment variable `AUTH_IP` to specify the IP ranges that have unrestricted access to your routes. For instructions see `config/config-secret.js`.

Note that intermediate proxies change the source IP of a request. Therefore enabling `allowAuthBypassForIpRanges` also
does instructs Express to trust the `X-FORWARDED-FOR` HTTP header typically added by proxies. This header can easily be
forged however.


## Framework Testing

To run tests for xtc enter `npm test`. This will start the mocha test runner.


## Differences to Terrific Composer

- The default tag of a generated wrapper for a markup module is SECTION instead of DIV.
- Directories containing module skins are called 'skins' instead of 'skin'. This default can be changed however.
- The overall file structure is flatter.
- The term *layout* refers to base documents. For global frontend logic you can use the pre-defined module `page-controller`.
- Terrific modules have some additional methods: `$$`, `bindAll`, `getName`. Defined in `frontend/application/js/00-terrific-extensions.js`.


## What xtc does not do (yet)


- Shared logic (client, server) to create correct state.
- Frontend dependency management
- Code and template re-use between browser and server.
- No client-side rendering is built in (yet), so info below is out of context:
	- Initial rendering is done at the server, subsequent changes are rendered directly in the browser.
	- 'Ajax crawling' support: non-JS clients can get a semantically sensible representation of any page URI.
	- Handlebars templates precompilation
- Easy appcache manifest generation with Grunt (Coming...)
- Database access from server and browser (Not that it's difficult)


## Contributing

If you want to contribute and make xtc better, your help is very welcome. Contributing is also a great way to learn
more about social coding on Github, Node.js and its awesome ecosystem and how to make constructive, helpful bug reports,
feature requests and the noblest of all contributions: a good, clean pull request.

**How to make a clean pull request**

- Create a your personal fork of xtc on Github.
- Clone the fork on your local machine. Your remote repo on Github is called `origin`.
- Add the original xtc repository as a remote called `upstream`.
- If you created your fork a while ago be sure to pull upstream changes into your local repository.
- Create a new branch to work on! Branch `develop` if it exists, else from `master`.
- Implement/fix your feature, comment your code.
- Follow the code style of the framework. And use tabs.
- Run the xtc's tests with `npm test`.
- Write or adapt the tests inside the `test` dir as needed.
- Add or change the documentation as needed.
- Squash your commits into a single commit with git's [interactive rebase](https://help.github.com/articles/interactive-rebase). Create a new branch if necessary.
- If you have problems doing any of this, ask (e.g. in the original issue on Github)
- Push your branch to your fork on Github, the remote `origin`.
- From your fork open a pull request in the correct branch. Target xtc's `develop` branch!
- ...
- Once the pull request is approved and merged you can pull the changes from `upstream` to your local repo and delete
your extra branch(es).
