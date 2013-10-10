# xtc <small>– frontend development server and framework</small>

This project brings the [Terrific.js](http://terrifically.org/) clever, yet simple frontend modularization pattern to
[Node](http://nodejs.org/) and [Express](http://expressjs.com/) and [implements](#terrific-modules) some of the features
of [Terrific Composer](http://terrifically.org/composer/), like server-side module includes. And much more...
It provides an awesome server, framework and template for most frontend projects.

The Terrific.js pattern prevents collisions between different areas of code, makes hassle-free collaboration and code
reuse in the frontend possible.

Express + Terrific + awesome = xtc

[![Build Status](https://travis-ci.org/MarcDiethelm/xtc.png?branch=master)](https://travis-ci.org/MarcDiethelm/xtc) master<br>
[![Build Status](https://travis-ci.org/MarcDiethelm/xtc.png?branch=develop)](https://travis-ci.org/MarcDiethelm/xtc) develop


## Table of Contents


- [Features](#features)
- [Installing Prerequisites](#installing-prerequisites)
	- [Node.js](#nodejs)
	- [Install xtc Dependencies](#install-xtc-dependencies)
	- [Optional: Sprites](#optional-sprites)
- [Project Setup](#project-setup)
	- [Configuration](#configuration)
	- [Asset Building: Grunt](#asset-building-grunt)
	- [Start the Server!](#asset-building-grunt)
	- [WebStorm / PHPStorm Users](#webstorm--phpstorm-users)
- [Manual](#manual)
	- [Naming Convention](#naming-convention)
	- [Templates and Views](#templates-and-views)
	- [Frontend Folder: Order matters](#frontend-folder-order-matters)
	- [Terrific Modules](#terrific-modules)
	- [Module Creation](#module-creation)
	- [Module Testing](#module-testing)
	- [Static Assets](#static-assets)
		- [LessCSS 1.5.0](#lesscss-150)
	- [Development and Production Mode](#development-and-production-mode)
	- [Building Sprites with Glue](#building-sprites-with-glue)
	- [Build Customization](#build-customization)
- [Template Development and Integration Into Other Backends](#template-development-and-integration-into-other-backends)
- [Basic Authentication and Bypass for IP Ranges](#basic-authentication-and-bypass-for-ip-ranges)
- [Framework Testing](#framework-testing)
- [Differences to Terrific Composer](#differences-to-terrific-composer)
- [What xtc does not do (yet)](#what-xtc-does-not-do-yet)
- [Contributing](#contributing)


## Features


- Light-weight, fast and hackable JavaScript backend
- Frontend modularization, modules are included by the server.
- Nice for single page apps.
- [Handlebars](http://handlebarsjs.com/) templates.
- [LessCSS](https://github.com/less/less.js) 1.5.0-b3
- Flexible automatic asset building using [Grunt.js](http://gruntjs.com/), with file watcher
- Automated sprites generation
- External, inline (todo: and dynamically loaded assets)
- [Automatic testing](#module-testing) of the current page (todo: test automation in multiple browsers, simultaneously)
- Project setup takes minutes.
- Interactive [generator](#terrific-module-creation) for modules, skins (todo: and projects).
- Ready for [deploying to Heroku](https://gist.github.com/MarcDiethelm/6321844) and Nodejitsu.

Want more features? There are more.

- Easy to configure. (Almost) everything in one place.
- The whole frontend is contained in one folder, called... frontend.
- Generated [project overview](#template-development-and-integration-into-other-backends) lists all views, modules and templates, with links to stand-alone, rendered source and repository.
- Lazy routing: just create a new view and use its filename as the URI.
- Basic styles for wireframing.
- Super-easy HTTP basic auth protection and access for IP ranges.
- Less @import (reference): Only includes what is actually used in your project. Great for libraries with mixins, helpers.


## Installing Prerequisites


Like any framework xtc depends on some other software to run. Installing the dependencies is easy and quick however.
And your next project will be able to use most functionality out of the box.


### Node.js

Download the Node.js [installer](http://nodejs.org/) or use a node version manager.

> It is recommended that you use a Node version manager for two reasons: NVMs install Node binaries AND any
global node modules in a hidden folder in your home directory. No need to use sudo and mess with your system.
Eventually you'll have multiple Node projects, possibly depending on different versions of Node.js and
global modules. With nave you can create named environments in a snap.

> So, install [Nave](https://github.com/isaacs/nave) from Github and install the latest stable Node.js version with
`nave use stable`. Nave will open a new shell for you where `node` points to your user space install.

Strictly speaking you don't NEED a node version manager. Downloading the installer from the Node.js website will work
just fine.

#### Windows users

<small>
I highly recommend you use [Git Bash](https://openhatch.org/missions/windows-setup/install-git-bash) as your command
line. The Windows cmd.exe is just too limited to be useful. Among other things you'll experience problems
installing git dependencies with npm and Nave does not work in the cmd.
</small>


### Install xtc Dependencies

With the Node installation comes [NPM](https://npmjs.org/) the [node package manager](https://npmjs.org/doc/cli/npm.html).
We'll use it to first install some command line tools that need to be installed globally:

```Bash
npm install -g grunt-cli yo generator-xtc
```

#### Optional: Sprites

If you want to use the automatic sprites generation you need to also install Glue and OptiPNG.

First make sure you have an up to date Python installation. Refer to the section "Properly Install Python" for your
platform, [from the official guide](http://docs.python-guide.org/en/latest/index.html). Mostly you need Homebrew and Pip.
After that, [install Glue](http://glue.readthedocs.org/en/latest/installation.html).

It worked if you can `glue -v` to get the installed version.

After that, [install OptiPNG](http://glue.readthedocs.org/en/latest/optipng.html). OptiPNG is a PNG optimizer that
recompresses image files to a smaller size. You may have to manually symlink optipng into /usr/local/bin (or another
folder in your path).


## Project Setup

Download [the latest xtc version](https://github.com/MarcDiethelm/xtc/archive/master.zip) and copy the files into your project folder.

Now install all the local node modules that xtc needs to function. In the project folder execute

```Bash
npm install
```


### Configuration

Set up your configuration in the folder  `_config`.

- `config-default.js` defines sensible defaults for all configurable properties.
- **`config-project.js`** is where you configure your app, overriding defaults.
- `config-secret.js` is for basic auth credentials, db authentication info, SSL certs and so on.
- `config-local.js` is used to override a configuration locally for development.

The files are merged into the app config in the order mentioned. Any property you add is merged with the previous,
overriding default properties as needed.

`config-secret.js` and `config-local.js` are listed in `.gitignore` and won't be committed to your repository.
`config-local.js` is also listed in `.jitsuignore`, so if you're using Nodejitsu for hosting this file will never be
deployed.  
Make sure these two files are not tracked by git unless you know what you're doing.


### Asset Building: Grunt

Before you can start the server you need to generate the assets for the frontend. You have already installed grunt-cli
globally. Now in your project enter `grunt`. That's it.
[Grunt](http://gruntjs.com/getting-started) will build your assets and also watch all your JS and Less/CSS source files
as configured in [Gruntfile.js](http://gruntjs.com/sample-gruntfile). When you edit them it re-generates the assets
automatically. You will have to restart Grunt for it to register
[any files in new folders](https://github.com/gruntjs/grunt-contrib-watch/issues/70) though! (This will be fixed
eventually.)

**Note:** The generated asset are not tracked by git as every developer must be able to create them on the fly.
Committing the files would produce tedious merge conflicts.
If you deploy your project using git do it from a branch where the assets are not ignored by git. (Just add a `!` before
a rule in `.gitignore` to negate it.)


### Start the Server!

Use a different terminal in your project folder (do you know `screen`?) and start the server with `node app.js`.


#### WebStorm / PHPStorm Users

There are some things you can do that will make development so much more easy:

* You can run Grunt directly in the IDE. Any errors during asset parsing will be immediately pointed out to you. If you
have the Command Line Tools plugin installed, open the Tools menu and select 'Run Command...'. Enter `grunt` in the
input line. Just make sure you have installed Grunt CLI globally with `npm install -g grunt-cli`.
(In WS 7 just the new terminal window.)
* You can run/restart Node directly in the IDE. If you have the Node.js plugin installed create a Run configuration
pointing to app.js. There's more than one way do get there. If in doubt refer to the documentation of your IDE.
* Install the Handlebars/Mustache plugin (included in WS 7). It will give you syntax highlighting for .hbs files. Also you can set the
comment style to Handlebars comments once you have the plugin.


## Manual


### Naming Convention

- use - (hyphen) for pretty much everything: module names, skins, template files
- 'lib' folders are for any third-party code that we don't touch: libraries, jquery plugins
- Files that start with an underscore are resources required for xtc's functionality.


### Templates and Views

In xtc the distinction between views and templates is as follows:

- View (`frontend/views`): A view typically corresponds to an individual page with an URL. This is where you include
any modules specific to the page.
- Templates (`frontend/views/templates`): Your basic document(s), typically a HTML document that contains all the things that are
always needed: HEAD, scripts, tracking and so on. Your template base template can be set in each route controller using
the layout property or disabled altogether with `layout: false`. The view is included with the `{{{body}}}` variable.

In Express templates are called layouts.

Terrific Modules too can define (multiple) templates for their own markup.

#### Filler Text

xtc includes [Hipsum.js](https://github.com/MarcDiethelm/Hipsum.js) so you can quickly generate filler text in your
templates. Check out the documentation there if needed.


### Frontend Folder: Order matters

A simple but important concept is to understand how the default folders in `/frontend` are included. Any files you throw
in there are included and executed like so:

- `_inline` folder: Any style or JS sources in here are available in the files `inline.js` and `inline.css`.
This is a good place for basic bootstrapping code and dependencies like an asset loader or possibly some initial data
for use in a model. Use wisely and sparingly.
- `_base` folder: Anything that needs to be defined before including any modules: LessCSS variables, mixins, grids,
some global JS code like Modernizr or other utilities and libraries and plugins. You can use [Less' @import (reference)](#lesscss-150)
- `modules/moduleName` folders: All your module code and styles, basically everything visible that's not pure layout.
- `_application` folder: The code that actually starts your app: Terrific bootstrap and any other global logic that
depends on modules being available. If you need to build themeing into your app, this is the place too.
- `public` folder: Anything that needs to be avialable to the world goes here, including the generated assets.

All these resources [are available to your templates](#static-assets) in concatenated and minified form
(except stuff that you put in the /public folder).


### Terrific Modules

Terrific modules can consist of Handlebars templates, LessCSS styles and a Terrific JS module.
Additionally you may use 'skins' to 'decorate' the main definitions of the module. Skins consist of LessCSS and JS files
inside a `skins` folder.

To include a module in a view or other module template use this syntax:

```Handlebars
{{mod "example"}}
```

A module's markup by default is wrapped in a generated SECTION tag, that at the minimum looks like this:

```HTML
<section class="mod mod-modulename"></section>
```

The HTML classes on the wrapper serve as 'binding sites' for the module's logic and styling.

A module include with all known options configured looks like this:

```Handlebars
{{mod "example" template="alternate" skins="alternate, baz" tag="article" id="foo" htmlClasses="test-class" data-connectors="stats, filter" data="{var1: 'foo'}"}}
```

This will generate the following wrapper:

```HTML
<article class="mod mod-example test-class skin-example-alternate skin-example-baz" id="foo" connectors="stats, filter"></article>
```

Please refer to the official docs at [Terrifically.org](http://terrifically.org/) to learn more about the Terrific
pattern. Just may safely ignore the part about "Composer".

You can use the `data` attribute on a module include to **inject data** (as a JS object literal) into the context of the
module template.

You can set any attribute on the module wrapper you want. Attributes not mentioned so far in this section will simply be added to the
markup. This includes HTML5 `data-` attributes.

You can enable **annotations** in the HTML output around modules in the config. The annotation displays the module name,
the template file name, the filesystem path and repository URL to the module.

Using the `noWrapper=true` attribute on a module include will prevent creation of the wrapper element and module annotation.
This is useful when creating markup-only modules in base layouts, e.g a HTML HEAD module including the doctype. You can
think of it like using **a partial but using modules** instead of yet another mechanism.


#### Module Creation

To create new Terrific modules there's a convenient [Yeoman](http://yeoman.io/index.html) generator called
[generator-xtc](https://github.com/MarcDiethelm/generator-xtc). Install it with

```Shell
npm install -g yo generator-xtc
```

To create a new module simply type

```Shell
yo xtc:module [name]
```

in the project root folder. The module name can be added as the first argument.


##### Skin Creation

Terrific modules can be extended or 'decorated' with JS or CSS [skins](http://terrifically.org/api/skin/).
To create a new module skin type

```Shell
yo xtc:skin [name]
```

in the project root folder. The skin name can be added as the first argument. You'll be asked to choose a module to
create the skin for.


#### Module Testing

You can write client-side tests with [QUnit](http://qunitjs.com/) for your Terrific modules. When your working on a page
on each refresh every module contained in the page has its tests run and the results printed to the console. This is
very useful to immediately see if something breaks during development.

To disable module testing set `enableModuleTesting` to false in the config.<br>
To use the classic QUnit display in the page set `QUnitFE.showUi` to true.<br>
QUnit adds a symbol to the HTML title indicating the test status. To disable set `QUnitFE.alterTitle` to false.

### Static Assets

If you look at config.js you will find that you can define the file system locations of your assets very flexibly.
This allows you to model file structures to your liking or to the requirements of a particular backend where your code
might need to be integrated.

The URIs to your static assets are all available under the `static` variable in your templates:

```JavaScript
static.prefix // The base URI to the static assets
static.img // The base URI to your images
static.build.js.external // The URI to the generated main JS file
static.build.css.external // The URI to the generated main CSS file
```

The static prefix URI is available in your LessCSS files as the variable

```Less
@static-prefix
```

Inline assets are available through a template helper, like so

```Handlebars
{{inline "js"}}
{{inline "css"}}
```

If you run the server in production mode the minified versions of these assets will be used.

#### LessCSS 1.5.0

Less files in `reference` folders (in `inline` and `base`) are included with Less 1.5.0's @import (reference):
Only mixins and variables that are actually used are imported. This is great for libraries of helper and mixins or UI
frameworks like Bootstrap.


### Development and Production Mode

Express determines which mode to use through an system environment variable `NODE_ENV` which either has the value `development`
or `production`. Generally speaking in dev mode resources aren't cached so that any changes that are made in the
frontend can be picked up. Also, in dev mode unminified asset versions are used for easier debugging.

You can conditionally render markup using the environment block helper...

```Handlebars
{{#env "production"}}<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>{{/env}}
{{#env "development"}}<script src="{{static.prefix}}/lib/jquery-1.10.1.js"></script>{{/env}}
```


### Building Sprites with Glue

* todo: doc sprites generation with node-glue
* todo: doc file locations and other options

http://glue.readthedocs.org/en/latest/options.html


### Build Customization

If you need more flexibility or a different feature, you can edit the `Gruntfile.js` where the build tasks are defined.
With [Grunt](#asset-building-grunt) there's almost no limit to what you can do.


## Template Development and Integration Into Other Backends

Node-terrific implements some features to help with template integration in different backend systems.

`/_home` displays an overview of all user-defined views and modules, i.e. ones whose names don't start with an
underscore. The page contains links to the views and modules at `/_view/[name]` and `/_module/[name]` respectively.
If you add the parameter `raw` to the URI, you get the pure HTML of that resource without any surrounding markup, e.g:

	/_view/example?raw
	/_module/example?raw

Adding the parameter `solo` to a view request, will skip any modules that have the attribute `isLayout="true"` on their
include tag.

	/_view/example?solo


## Basic Authentication and Bypass for IP Ranges

Password protecting content couldn't be easier. To restrict access you add BasicAuth to the route that accesses the
sensitive resource.

```JavaScript
app.get('/data/:someParam', app.authBasic('user'), index.data);
```

Just insert the authentication middleware as shown in the snippet above. The argument to `app.authBasic` is the required
username. The username/password combination is defined in `config/config-secret.js` as a key/value pair.

You can open the restricted routes to certain IP ranges if you so desire. For security reasons you need to enable this
feature by adding the property `allowAuthBypassForIpRanges: true` in `_config/config-project.js`.

In `config/config-secret.js` you can then specify the IP ranges that have unrestricted access to your routes.

Note that intermediate proxies change the source IP of a request. Therefore enabling `allowAuthBypassForIpRanges` also
does instructs Express to trust the `X-FORWARDED-FOR` HTTP header typically added by proxies. This header can easily be
forged however.


## Framework Testing

To run tests for xtc enter `npm test`. This will start the mocha test runner.


## Differences to Terrific Composer

- The default tag of a generated wrapper for a markup module is SECTION instead of DIV.
- Dierctories containing module skins are called 'skins' instead of 'skin'. This default can be changed however.


## What xtc does not do (yet)


- Shared logic (client, server) to create correct state.
- Dependency management
- Code and template re-use between browser and server.
- No client-side rendering is built in (yet), so info below is out of context:
	- Initial rendering is done at the server, subsequent changes are rendered directly in the browser.
	- 'Ajax crawling' support: non-JS clients can get a semantically sensible representation of any page URI.
	- Handlebars templates precompilation
- Easy appcache manifest generation with Grunt (Coming...)
- Database access from server and browser (Not that it's difficult)


## Contributing

If you want to contribute and make xtc better, your help is very welcome. Contributing is also a great way to learn
more about social coding on Github, Node.js and its awesome ecosystem and how to make constructive bug reports, feature
requests and the noblest of all contributions: clean pull requests.

How to make a clean pull request

- Create a fork of xtc on Github, clone the fork on your local machine. Your remote repo on Github is called `origin`.
- Add the original xtc repository as a remote called `upstream`.
- Create a new branch to work on!
- Implement/fix your feature, comment your code.
- Follow the code style of the framework. And use tabs.
- Write or adapt framework tests as needed.
- Add change the documentation as needed.
- Squash your commits into one with git's interactive rebase. Use a new branch if necessary.
- If you have problems doing any of this, ask (e.g. in the original issue on Github)
- Push your branch to your fork on Github, the remote `origin`.
- From your fork open a pull request in the correct branch. Target xtc's `develop` branch!
- ...
- Profit!
- Once the pull request is approved and merged you can pull the changes from `upstream` to your local repo and delete
your extra branch(es).
