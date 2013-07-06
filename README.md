# Node Terrific

This project brings the Terrific.js clever, yet simple frontend modularization pattern to Node and Express and
[implements][modules] some of the features of Terrific Composer, like server-side module includes. And much more...
It provides an awesome server, framework and template for most frontend projects.

The Terrific.js pattern prevent collisions between different areas of code, makes hassle-free collaboration and code
reuse in the frontend possible.


## Features


- Light-weight, fast and hackable JavaScript backend
- Can be used for single page apps.
- Server-side module includes.
- Handlebars templates.
- Modularization
- Flexible asset pipeline using Grunt.js, with file watcher // tbd: with sections for inlined, linked and on-demand assets.
- Todo: Automated testing
- Project setup takes minutes
- todo: Grunt.js templates for efficient and consistent project and module creation.

At risk:

- NPM packaging this project as a tool for super-easy project creation


## DOCS


### Installing Node.js

It is highly recommended that you use a Node version manager for two reasons: NVMs install Node binaries AND any
global node modules in a hidden folder in your home directory. No need to use sudo and mess with your system.
Eventually you'll have multiple Node projects, depending on different versions of Node.js and
global modules. With nave you can create named environments in a snap.

So, install [Nave](https://github.com/isaacs/nave) from Github and install the latest stable Node.js version with
`nave use stable`. Nave will open a new shell for you where `node` points to your user space install.

However, strictly speaking you don't NEED a node version manager. Downloading the installer from the website will work
fine.

<small>Windows users:  after installing reopen the CMD to get the updated path, so you can use npm.</small>


### Node Modules dependencies

After that you can just do `npm install` in the project folder and all dependencies of the server part will be
installed.


### Configuration

After cloning you should set up your configuration files in `_config`. Initially there are just two that are actually
read: `config-default.js` and `config-project.js`. However you can create two more from the templates provided in the
same folder: `config-secret.js` and `config-local.js`. They are merged into the app config in the order mentioned.

Use `config-local` to override a configuration locally when in development mode.
Use `config-secret.js` for authentication data, SSL certs and so on.

Both additional files are listed in `.gitignore` and won't be committed to your repository. `config-local` is also listed
in `.jitsuignore`, so if you're using Nodejitsu for hosting this file will never be deployed.


### Asset Building: Grunt

Before you can start the server you need to generate the assets for the frontend. Use the terminal in your project
folder and enter `grunt`. That's it. Grunt will watch all your JS and Less/CSS source files as configured in
Gruntfile.js and re-generate the assets automatically when you edit them. You will have to re-start Grunt for it to
register [any files in new folders](https://github.com/gruntjs/grunt-contrib-watch/issues/70) though!

If you want to use the automatic sprites generation there are some more steps on your todo list. You only need to do
this once though. Your next project will be able to use the functionality out of the box.

First make sure you have an up to date Python installation. Refer to the section "Properly Install Python" for your
platform, [from the official guide](http://docs.python-guide.org/en/latest/index.html). Mostly you need Homebrew and Pip.
After that, [install Glue](http://glue.readthedocs.org/en/latest/installation.html).

It worked if you can `glue -v` to get the installed version.

After that, [install OptiPNG](http://glue.readthedocs.org/en/latest/optipng.html). OptiPNG is a PNG optimizer that
recompresses image files to a smaller size. You may have to manually symlink optipng into /usr/local/bin (or another
folder in your path).


### Start the server!

Use a different terminal in your project folder (do you know `screen`?) and start the server with `node app.js`.


### PHPStorm / WebStorm Users

There are some things you can do that will make development so much more easy:

* You can run Grunt directly in the IDE. Any errors during asset parsing will be immediately pointed out to you. If you
have the Command Line Tools plugin installed, open the Tools menu and select 'Run Command...'. Enter `grunt` in the
input line. Just make sure you have installed Grunt CLI globally with `npm install -g grunt-cli`.
* You can run/restart Node directly in the IDE. If you have the Node.js plugin installed create a Run configuration
pointing to app.js. There's more than one way do get there. If in doubt refer to the documentation of your IDE.
* Install the Handlebars/Mustache plugin. It will give you syntax highlighting for .hbs files. Also you can set the
comment style to Handlebars comments once you have the plugin.


## Manual


### Naming Convention

- use - (hyphen) for pretty much everything: module names, skins, template files
- 'lib' folders are for any third-party code that we don't touch: libraries, jquery plugins


### Templates and views

In node-terrific the distinction between templates and views are as follows:

- Templates (`/templates`): Your basic document(s), typically a HTML document that contains all the things that are
always needed: HEAD, scripts, tracking and so on. Your template base template can be set in each route controller using
the layout property or disabled altogether with `layout: false`. A template that has a `{{{body}}}` variable will
include a
- View (`/frontend/views`): A view typically corresponds to an individual page with an URL. This is where you include
any modules specific to the page.

Modules can also define multiple templates for their markup.


### Terrific Folder: Order matters [resources]

A simple but important concept is to understand how the default folders in /terrific are included. Any files you throw
in there are included and executed like so:

- `_inline` folder: Any style or JS sources in here are available in the files `inline.js` (todo: and `inline.css`).
This is a good place for basic bootstrapping code and dependencies like an asset loader or possibly some initial data
for use in a model. Use wisely and sparingly.
- `base` folder: anything that needs to be defined before including any modules: LessCSS variables, mixins, grids,
some global JS code like Modernizr or other utilities and libraries and plugins.
- `mod-something` folders: All your module code and styles, basically everything visible that's not pure layout.
- `_application` folder: The code that actually starts your app: Terrific bootstrap and any other global logic that
depends on modules being available. If you need to build themeing into your app, this is the place too.

All these resources are available to your templates as [assets] in concatenated and minified form
(except stuff in /lib folders).


### Terrific Modules [modules]

Terrific modules can consist of Handlebars templates, LessCSS styles and a Terrific JS module.
Additionally you may create LessCSS and JS skins inside a `skin` folder. These skins can be used to 'decorate' the
main definitions of the module.

To include a module in a Handlebars template use this syntax:

	{{mod "example"}}

A module include with all the options configured looks like this:

	{{mod "example" template="alternate" skins="alternate, baz" tag="section" id="foo" htmlClasses="test-class" connectors="stats, filter" data="{var1: 'foo'}"}}

Please refer to the official docs at [Terrifically.org](http://terrifically.org/) to learn more about the Terrific
pattern. Just ignore the part about "Composer". :)

A module's markup will by default be wrapped in a SECTION tag, which also has the following class value:

	mod mod-modulename [skin-modulename-skinname]

The wrapper classes serve as attachment points for the module's logic and styling.

You can enable **annotations** around modules in the html output, in config.js. The annotation displays the module name,
the template file name and the file system path to the module.

You can use a `data` attribute on a module include to **inject data** (a JS object literal) into the context of the
module template.

todo: Using the `noWrapper` and `noAnnotation` attributes on a module include will prevent creation of the wrapper element and/or
module annotation. This is useful when creating markup-onöy modules in base layouts, e.g a HTML HEAD module including the doctype.


### Terrific Module Creation

To create new Terrific modules you can conveniently use a Yeoman generator. Install it with

	npm install -g yo generator-xtc

To create a new module simply type

	yo xtc:module [name]

in the project root folder. The module name can be added as the first argument.


### Skin Creation

coming soon


### Module Testing

Todo: You can write client-side tests for your Terrific modules. For any page your currently working on each contained module
is tested atomically and the results are printed to the console. It's somewhat limited because it's not application-wide
and doesn't provide for inter-module (i.e. connectors) testing. But it's still very useful to see if something breaks on
any given page.

### Static Assets [assets]

If you look at config.js you will find that you can define the file system locations of your assets very flexibly.
This allows you to model file structures to your liking or to the requirements of a particular backend where your code
might need to be integrated.

The URIs to your static assets are all available under the `static` variable in your templates:

	static.prefix // The base URI to the static assets
	static.img // The base URI to your images
	static.build.js.external // The URI to the generated main JS file
	static.build.css.external // The URI to the generated main CSS file

The static prefix URI is available in your LessCSS files as the variable

	@static-prefix

Inline assets are available through a template helper, like so

	{{inline "js"}}
	{{inline "css"}}

If you run the server in production mode the minified versions of these assets will be used.

### Development and Production Mode

Express determines which mode to use through an system environment variable `NODE_ENV` which either has the value `development`
or `production`. Generally speaking in dev mode resources aren't cached so that any changes that are made in the
frontend can be picked up. Also, in dev mode unminified asset versions are used for easier debugging.

You can conditionally render markup using the environment block helper...

	{{#env "production"}}<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.1/jquery.min.js"></script>{{/env}}
	{{#env "development"}}<script src="{{static.prefix}}/lib/jquery-1.10.1.js"></script>{{/env}}


### Building sprites with Glue

* todo: doc sprites generation with node-glue
* todo: doc file locations and other options
* todo: disable sprite generation in config.js (default)

http://glue.readthedocs.org/en/latest/options.html


## Template Development and Integration into other backends

Node-terrific implements some features to help with template integration in different backend systems.

`/_home` displays an overview of all user-defined views and modules, i.e. ones whose names don't start with an
underscore. The page contains links to the views and modules at `/_view/[name]` and `/_module/[name]` respectively.
If you add the parameter `raw` to the URI, you get the pure HTML of that resource without any surrounding markup, e.g:

	/_view/example?raw
	/_module/example?raw

Adding the parameter `solo` to a view request, will skip any modules that have the attribute `isLayout="true"` on their
include.

	/_view/example?solo


## Differences to Terrific Composer

- The default tag of a generated wrapper for a markup module is SECTION instead of DIV.


## What this does not (yet)


- shared logic to create correct state
- Dependency management
- Code and template re-use between browser and server.
- No client-side rendering is built in, so info below is out of context:
	- Initial rendering is done at the server, subsequent changes are rendered directly in the browser.
	- 'Ajax crawling' support: non-JS clients can get a semantically sensible representation of any page URI.
	- Handlebars templates precompilation
- Easy appcache manifest generation through Grunt
- database access from server and browser