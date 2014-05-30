<sup>Master</sup>&nbsp;[![Build status (master)](http://b.adge.me/travis/MarcDiethelm/xtc/master.svg)](https://travis-ci.org/MarcDiethelm/xtc) &nbsp; <sup>Develop</sup>&nbsp;[![Build status (develop)](http://b.adge.me/travis/MarcDiethelm/xtc/develop.svg)](https://travis-ci.org/MarcDiethelm/xtc) &nbsp;&nbsp; ![MIT license](http://b.adge.me/:license-MIT-brightgreen.svg) &nbsp;&nbsp; [![Follow @xtcjs](http://b.adge.me/:@xtcjs-follow-green.svg)](https://twitter.com/xtcjs) &nbsp;&nbsp; [![gittip donate](http://b.adge.me/:gittip-donate-lightgrey.svg)](https://www.gittip.com/MarcDiethelm/)


# xtc <small>– frontend development server and framework</small>

This project provides an awesome server and framework for almost any frontend project.
It is all about building and running web frontends – and making it easy, efficient and fun.

*Hey, how would you like to build websites from clean, encapsulated modules that contain their markup, scripts, styles and even tests?*

xtc implements [Terrific.js'](http://terrifically.org/) clever, yet simple frontend modularization pattern in [Node.js](http://nodejs.org/) and [Express](http://expressjs.com/). It lets you use simple [Handlebars](http://handlebarsjs.com/) syntax to construct pages from re-usable modules that you call in your templates. The modules encapsulate different areas of code, preventing collisions and make hassle-free collaboration possible.

xtc sets up Express and uses [Grunt](http://gruntjs.com/) and [Yeoman](http://yeoman.io/) to take as much work away from you as possible. It automatically builds your assets and generates new modules for you. xtc projects can be [deployed](#deploying) in a snap. All *you* have to do is *code*.

- \# [About Modules](#about-modules)
- \# [Frontend Structure: Phases](#frontend-structure-phases)
- \# [Features](#features)
- \# [Quick Start](#quick-start)
- [&nbsp;&nbsp; Documentation](Documentation.md)
- [&nbsp;&nbsp; Releases](https://github.com/MarcDiethelm/xtc/releases)
- [⇗ **Demo site**](http://xtc.starfleet.info) from the [xtc-site repository](https://github.com/MarcDiethelm/xtc-site).<br>


## About Modules

To include a module in a view or another module you simply write:

```hbs
{{mod "example"}}
```

That is the shortest form. The module call can take many different [options](https://github.com/MarcDiethelm/xtc/blob/develop/Documentation.md#terrific-modules) tough.

As mentioned earlier Terrific modules are self-contained Frontend components. A module basically is a folder with a structure like this:

	my-module/
		my-module.hbs
		my-module-variation.hbs
		my-module.js
		my-module.less
		test/
			my-module.test.js
		skins/
			my-module-variation.js
			my-module-variation.less
		sprites/
			icon.png

This example is for a full-fledged module (including [sprites](https://github.com/MarcDiethelm/xtc/blob/develop/Documentation.md#building-sprites-with-glue)). A module however can also just consist exclusively of markup or styling or logic.

A markup module is rendered in a wrapper.

```html
<section class="mod mod-my-module">
	my-module's markup
</section>
```

The wrapper serves as an exclusive context or namespace for the module's DOM logic and style sheets. A JS-only module can be applied "globally', i.e. to the whole page.

New modules can be generated with an interactive little CLI tool. You start it with:

```sh
npm run mkmod
```

## Frontend Structure: Phases

The frontend code is structured into different *phases*.

- **Inline**<br>
	<sup>immediate bootstrapping</sup>
- **External**<br>
	<sup>concatenated <sup>[todo: ...into bundles]</sup></sup>
	- Base
	- Modules
	- Application <sup>[under assessment]</sup>
- **Async**<br>
	<sup>lazy loaded</sup>
	- Modules <sup>[todo]</sup>
	- Static assets

These phases are processed in separate build pipelines and used as separate resources in the browser.

## Such.less CSS

By default xtc contains an extremely helpful CSS framework called [⇗ such.less](https://github.com/MarcDiethelm/such.less). More details coming soon. Wow.


## Features


- Light-weight, fast and hackable JavaScript backend
- Frontend modularization, modules are included by the server.
- Nice for single page apps.
- [Handlebars](http://handlebarsjs.com/) templates.
- [LessCSS](https://github.com/less/less.js) 1.6.0
- Flexible automatic asset building using [Grunt.js](http://gruntjs.com/), with file watcher
- Automatic sprites generation
- External, inline (todo: and dynamically loaded assets)
- [Automatic testing](#module-testing) of the current page (todo: test automation in multiple browsers, simultaneously)
- Project setup takes minutes.
- Interactive [generator](#terrific-module-creation) for modules, skins and projects.
- Ready for [deploying to Heroku](https://gist.github.com/MarcDiethelm/6321844), Digital Ocean or Nodejitsu.

Want more features? There are more.

- Can be used as a Terrific build tool in foreign frameworks that do their own Terrific module includes.
- Easy to configure. (Almost) everything in one place.
- The whole frontend is contained in one folder, called... frontend.
- Less [@import (reference)](http://lesscss.org/features/#import-options-reference): Only includes what is actually used in your project. Great for libraries with mixins, helpers.
- Generated [project overview](https://github.com/MarcDiethelm/xtc/blob/master/Documentation.md#project-overview) lists all views, modules and layouts, with links to stand-alone, rendered source and repository.
- Lazy routing: just create a new view and use its filename as the URI.
- Helpful, friendly error messages if you do something wrong.
- Basic styles for wireframing.
- Filler text template helper [Hipsum.js](https://github.com/MarcDiethelm/Hipsum.js).
- Super-easy HTTP basic auth protection and access for IP ranges.


## Quick Start

- Install [Node.js](http://nodejs.org/).
- Open a terminal and execute `npm install -g xtc-cli yo grunt-cli`.
- In the terminal, change to the project folder and start the xtc install and project generator: `xtc install`.
- Start the dev build and file watcher: `xtc build`.
- Open a new terminal session and start the server with `xtc start`.
- Now you can visit `localhost:3000` in a browser.

That's it. Start building websites!

There's an extensive [documentation](Documentation.md) to familiarize you with all aspects of xtc.
