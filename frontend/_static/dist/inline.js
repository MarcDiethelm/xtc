/**
 * lawg.js
 *
 * A logging and debugging helper for the browser
 * Author: Marc Diethelm
 *

 - It's tiny.
 - Global functions for the common firebug/browser console methods (as available). Those functions are:
 	log,
 	info,
 	debug,
 	error,
 	dir,
 	table.
 - IE with Developer Tools add-on provides a console object, but the log method only prints the first argument.
 Lawg's window.log() will concatenate and output anything (eventually maybe) you throw at it.
 - If no console object is available the concatenated arguments will be output in window.alert.
 - To make logging with alerts actually useful certain objects are output with special representations.
   This is extremely helpful for debugging on mobile devices.
 	- DOM elements are shown in the format: tagName[#id][.className][.className][...]
 	- jQuery collections are displayed as: $([DOM element][, DOM element][...])
 	- NodeLists are displayed as: NodeList[[DOM element][, DOM element][...]]
 	- Arrays items of the types listed above are 'deep converted' also.
 	- Everything else uses its own native JS toString method.
 - Use window._alert to bypass console logging altogether.
 - Lawg extends jQuery with a log method. Log any jQuery collection to the console/ to an alert with
 		$(selector).log([@param clear Boolean]). If you set the optional parameter clear to true,
 	the previous console output is cleared before logging.
 - Lawg extends jQuery with an alert method. Output any jQuery collection to an alert with
 		$(selector).alert()

 */

(function() {

	var  w = window
		,c
		,isElement
		,isjQuery
		,isArray
	;
	
	function concatArgs(args, nestedCall) {
		var aStr = []
			,i
			,arg
			,delim = nestedCall ? ', ' : ',\n'
		;

		for (i = 0; i<args.length; i++) {
			arg = args[i];
			if (arg !== undefined && arg !== null) {

				if (isArray(arg))
					aStr.push('[' + arguments.callee(Array.prototype.slice.call(arg), true) + ']');
				// if this is an DOM element node, show an appropriate representation.
				else if (isElement(arg))
					aStr.push( elementToString(arg) );
				// if this is a jQuery object, use the log method plugin defined below
				else if (isjQuery(arg))
					aStr.push(jQueryToString(arg));
				// if it's a NodeList 'convert' it to an array and then... magic
				else if (arg.toString() == '[object NodeList]')
					aStr.push('NodeList[' + arguments.callee(Array.prototype.slice.call(arg), true) + ']');
				// for everything else use native JS toString methods. Or fail miserably! :((
				else
					aStr.push(arg.toString());
			 // arg is either undefined or null. Let the JS engine convert it to string.
			} else
				aStr.push(arg + '');

		}
		return aStr.join(delim);
	}

	function elementToString(elem) {
		var htmlId = ''
		    ,htmlClass = ''
		;
		elem.id && (htmlId = '#' + elem.id); 
		elem.className && (htmlClass = '.' + elem.className.replace(/\s/g, '.')); // replace any white space with a '.'
		return elem.tagName + htmlId + htmlClass;
	}
	
	function jQueryToString($obj) {
		var i
			,stringArray = []
		;
		for (i=0; i<$obj.length; i++) {
			stringArray.push( elementToString($obj[i]) );
		}
		
		return '$('+ stringArray.join(', ') +')';
	}
	
	//Resulting function returns true if param is a DOM element
	if (typeof HTMLElement == 'function') {
		isElement = function(obj) { return obj instanceof HTMLElement }
	}
	else {
		isElement = function(obj) { return typeof obj == 'object' && obj.nodeType === 1 && typeof obj.nodeName==='string' }
	}
	
	// Resulting function returns true if param is a jQuery object
	try {
		$() instanceof jQuery; // abusing try/catch for flow control. Old crappy browsers (I'm lookin at you IE) will throw.
		isjQuery = function(obj) { return obj instanceof jQuery }
	} catch (e) {
		isjQuery = function(obj) { return 'jquery' in obj && typeof obj.jquery == 'string' }
	}

	isArray = Array.isArray || function(obj) {
		return toString.call(obj) == '[object Array]';
	};
	
	if (w.console) {
		c = console;
		if ('dir' in c && 'apply' in c.dir) { // create global shortcuts
			typeof c.log   === 'function' && ( w.log   = function() { c.log.apply(c, arguments) } );
			typeof c.info  === 'function' && ( w.info  = function() { c.info.apply(c, arguments) } );
			typeof c.debug === 'function' && ( w.debug = function() { c.debug.apply(c, arguments) } );
			typeof c.error === 'function' && ( w.error = function() { c.error.apply(c, arguments) } );
			typeof c.dir   === 'function' && ( w.dir   = function() { c.dir.apply(c, arguments) } );
			typeof c.table === 'function' && ( w.table = function() { c.table.apply(c, arguments) } );
		}
		else { // IE: we have console.log but it just accepts one param. let's fix that! :)
			w.log = function() {
				c.log(concatArgs(arguments));
			}
		}

		clear = c.clear; // supported in IE and Fx
	}
	else {
		w.log = function() { alert(concatArgs(arguments)) };
	}
	
	w._alert = function() { alert(concatArgs(arguments)) };

	/**
	 * A tiny jQuery plugin adding logging to any jQuery object
	 * @param clear Boolean Clear the console before logging?
	 */
	
	w.jQuery && (jQuery.fn.log = function(clear) {
		clear && c.clear.call(c);
		c.log.call(c, this);
		return this;
	});
	
	w.jQuery && (jQuery.fn.alert = function() {
		w._alert(concatArgs(this));
	});
	
})();

/*

Copyright (C) 2011 by Yehuda Katz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// lib/handlebars/base.js

/*jshint eqnull:true*/
this.Handlebars = {};

(function(Handlebars) {

Handlebars.VERSION = "1.0.0-rc.3";
Handlebars.COMPILER_REVISION = 2;

Handlebars.REVISION_CHANGES = {
  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
  2: '>= 1.0.0-rc.3'
};

Handlebars.helpers  = {};
Handlebars.partials = {};

Handlebars.registerHelper = function(name, fn, inverse) {
  if(inverse) { fn.not = inverse; }
  this.helpers[name] = fn;
};

Handlebars.registerPartial = function(name, str) {
  this.partials[name] = str;
};

Handlebars.registerHelper('helperMissing', function(arg) {
  if(arguments.length === 2) {
    return undefined;
  } else {
    throw new Error("Could not find property '" + arg + "'");
  }
});

var toString = Object.prototype.toString, functionType = "[object Function]";

Handlebars.registerHelper('blockHelperMissing', function(context, options) {
  var inverse = options.inverse || function() {}, fn = options.fn;


  var ret = "";
  var type = toString.call(context);

  if(type === functionType) { context = context.call(this); }

  if(context === true) {
    return fn(this);
  } else if(context === false || context == null) {
    return inverse(this);
  } else if(type === "[object Array]") {
    if(context.length > 0) {
      return Handlebars.helpers.each(context, options);
    } else {
      return inverse(this);
    }
  } else {
    return fn(context);
  }
});

Handlebars.K = function() {};

Handlebars.createFrame = Object.create || function(object) {
  Handlebars.K.prototype = object;
  var obj = new Handlebars.K();
  Handlebars.K.prototype = null;
  return obj;
};

Handlebars.logger = {
  DEBUG: 0, INFO: 1, WARN: 2, ERROR: 3, level: 3,

  methodMap: {0: 'debug', 1: 'info', 2: 'warn', 3: 'error'},

  // can be overridden in the host environment
  log: function(level, obj) {
    if (Handlebars.logger.level <= level) {
      var method = Handlebars.logger.methodMap[level];
      if (typeof console !== 'undefined' && console[method]) {
        console[method].call(console, obj);
      }
    }
  }
};

Handlebars.log = function(level, obj) { Handlebars.logger.log(level, obj); };

Handlebars.registerHelper('each', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  var i = 0, ret = "", data;

  if (options.data) {
    data = Handlebars.createFrame(options.data);
  }

  if(context && typeof context === 'object') {
    if(context instanceof Array){
      for(var j = context.length; i<j; i++) {
        if (data) { data.index = i; }
        ret = ret + fn(context[i], { data: data });
      }
    } else {
      for(var key in context) {
        if(context.hasOwnProperty(key)) {
          if(data) { data.key = key; }
          ret = ret + fn(context[key], {data: data});
          i++;
        }
      }
    }
  }

  if(i === 0){
    ret = inverse(this);
  }

  return ret;
});

Handlebars.registerHelper('if', function(context, options) {
  var type = toString.call(context);
  if(type === functionType) { context = context.call(this); }

  if(!context || Handlebars.Utils.isEmpty(context)) {
    return options.inverse(this);
  } else {
    return options.fn(this);
  }
});

Handlebars.registerHelper('unless', function(context, options) {
  var fn = options.fn, inverse = options.inverse;
  options.fn = inverse;
  options.inverse = fn;

  return Handlebars.helpers['if'].call(this, context, options);
});

Handlebars.registerHelper('with', function(context, options) {
  return options.fn(context);
});

Handlebars.registerHelper('log', function(context, options) {
  var level = options.data && options.data.level != null ? parseInt(options.data.level, 10) : 1;
  Handlebars.log(level, context);
});

}(this.Handlebars));
;
// lib/handlebars/utils.js

var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

Handlebars.Exception = function(message) {
  var tmp = Error.prototype.constructor.apply(this, arguments);

  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
  for (var idx = 0; idx < errorProps.length; idx++) {
    this[errorProps[idx]] = tmp[errorProps[idx]];
  }
};
Handlebars.Exception.prototype = new Error();

// Build out our basic SafeString type
Handlebars.SafeString = function(string) {
  this.string = string;
};
Handlebars.SafeString.prototype.toString = function() {
  return this.string.toString();
};

(function() {
  var escape = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "`": "&#x60;"
  };

  var badChars = /[&<>"'`]/g;
  var possible = /[&<>"'`]/;

  var escapeChar = function(chr) {
    return escape[chr] || "&amp;";
  };

  Handlebars.Utils = {
    escapeExpression: function(string) {
      // don't escape SafeStrings, since they're already safe
      if (string instanceof Handlebars.SafeString) {
        return string.toString();
      } else if (string == null || string === false) {
        return "";
      }

      if(!possible.test(string)) { return string; }
      return string.replace(badChars, escapeChar);
    },

    isEmpty: function(value) {
      if (!value && value !== 0) {
        return true;
      } else if(Object.prototype.toString.call(value) === "[object Array]" && value.length === 0) {
        return true;
      } else {
        return false;
      }
    }
  };
})();;
// lib/handlebars/runtime.js
Handlebars.VM = {
  template: function(templateSpec) {
    // Just add water
    var container = {
      escapeExpression: Handlebars.Utils.escapeExpression,
      invokePartial: Handlebars.VM.invokePartial,
      programs: [],
      program: function(i, fn, data) {
        var programWrapper = this.programs[i];
        if(data) {
          return Handlebars.VM.program(fn, data);
        } else if(programWrapper) {
          return programWrapper;
        } else {
          programWrapper = this.programs[i] = Handlebars.VM.program(fn);
          return programWrapper;
        }
      },
      programWithDepth: Handlebars.VM.programWithDepth,
      noop: Handlebars.VM.noop,
      compilerInfo: null
    };

    return function(context, options) {
      options = options || {};
      var result = templateSpec.call(container, Handlebars, context, options.helpers, options.partials, options.data);

      var compilerInfo = container.compilerInfo || [],
          compilerRevision = compilerInfo[0] || 1,
          currentRevision = Handlebars.COMPILER_REVISION;

      if (compilerRevision !== currentRevision) {
        if (compilerRevision < currentRevision) {
          var runtimeVersions = Handlebars.REVISION_CHANGES[currentRevision],
              compilerVersions = Handlebars.REVISION_CHANGES[compilerRevision];
          throw "Template was precompiled with an older version of Handlebars than the current runtime. "+
                "Please update your precompiler to a newer version ("+runtimeVersions+") or downgrade your runtime to an older version ("+compilerVersions+").";
        } else {
          // Use the embedded version info since the runtime doesn't know about this revision yet
          throw "Template was precompiled with a newer version of Handlebars than the current runtime. "+
                "Please update your runtime to a newer version ("+compilerInfo[1]+").";
        }
      }

      return result;
    };
  },

  programWithDepth: function(fn, data, $depth) {
    var args = Array.prototype.slice.call(arguments, 2);

    return function(context, options) {
      options = options || {};

      return fn.apply(this, [context, options.data || data].concat(args));
    };
  },
  program: function(fn, data) {
    return function(context, options) {
      options = options || {};

      return fn(context, options.data || data);
    };
  },
  noop: function() { return ""; },
  invokePartial: function(partial, name, context, helpers, partials, data) {
    var options = { helpers: helpers, partials: partials, data: data };

    if(partial === undefined) {
      throw new Handlebars.Exception("The partial " + name + " could not be found");
    } else if(partial instanceof Function) {
      return partial(context, options);
    } else if (!Handlebars.compile) {
      throw new Handlebars.Exception("The partial " + name + " could not be compiled when running in runtime-only mode");
    } else {
      partials[name] = Handlebars.compile(partial, {data: data !== undefined});
      return partials[name](context, options);
    }
  }
};

Handlebars.template = Handlebars.VM.template;
;

this["JST"] = this["JST"] || {};

this["JST"]["home"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "\n\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "bootstrap-carousel", options) : helperMissing.call(depth0, "mod", "bootstrap-carousel", options)))
    + "\n\n";
  return buffer;
  });

this["JST"]["test-modules"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


  buffer += "<h2>Test: module includes</h2>\n\n"
    + "{{mod \"foo\"}}<br>\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "foo", options) : helperMissing.call(depth0, "mod", "foo", options)))
    + "\n<br>\n<br>\n"
    + "{{mod \"foo\" template=\"alternate\"}}<br>\n";
  options = {hash:{
    'template': ("alternate")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "foo", options) : helperMissing.call(depth0, "mod", "foo", options)))
    + "\n<br>\n<br>\n"
    + "{{mod \"foo\" tag=\"aside\" skins=\"sheep, alternate\" connectors=\"stats, filter\"}}<br>\n";
  options = {hash:{
    'tag': ("aside"),
    'skins': ("sheep, alternate"),
    'connectors': ("stats, filter")
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "foo", options) : helperMissing.call(depth0, "mod", "foo", options)))
    + "\n<br>\n<br>\n"
    + "{{mod \"foo\" template=\"alternate\" skins=\"alternate, baz\" htmlClasses=\"test-class\" connectors=\"stats, filter\" indent=2}}<br>\n";
  options = {hash:{
    'template': ("alternate"),
    'skins': ("alternate, baz"),
    'htmlClasses': ("test-class"),
    'connectors': ("stats, filter"),
    'indent': (2)
  },data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "foo", options) : helperMissing.call(depth0, "mod", "foo", options)))
    + "\n<br>\n<br>\n"
    + "{{mod \"bar\"}} Includes module foo...<br>\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "bar", options) : helperMissing.call(depth0, "mod", "bar", options)))
    + "\n<br>\n<br>\n"
    + "{{mod \"nothing\"}} Doesn't exist! We should get an error message.<br>\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "nothing", options) : helperMissing.call(depth0, "mod", "nothing", options)));
  return buffer;
  });

this["JST"]["bar"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


  buffer += "Module bar<br>\n";
  if (stack1 = helpers.data) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.data; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\n\n";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.mod),stack1 ? stack1.call(depth0, "foo", options) : helperMissing.call(depth0, "mod", "foo", options)));
  return buffer;
  });

this["JST"]["bootstrap-carousel"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<span class=\"wf-label\">.mod-bootstrap-carousel</span>\n<div id=\"myCarousel\" class=\"carousel slide\">\n	<ol class=\"carousel-indicators\">\n		<li data-target=\"#myCarousel\" data-slide-to=\"0\" class=\"active\"></li>\n		<li data-target=\"#myCarousel\" data-slide-to=\"1\"></li>\n		<li data-target=\"#myCarousel\" data-slide-to=\"2\"></li>\n	</ol>\n	<!-- Carousel items -->\n	<div class=\"carousel-inner\">\n		<div class=\"active item\"><img src=\"http://placehold.it/320x180&text=Slide 1\"></div>\n		<div class=\"item\"><img src=\"http://placehold.it/320x180&text=Slide 2\"></div>\n		<div class=\"item\"><img src=\"http://placehold.it/320x180&text=Slide 3\"></div>\n	</div>\n	<!-- Carousel nav -->\n	<a class=\"carousel-control left\" href=\"#myCarousel\" data-slide=\"prev\">&lsaquo;</a>\n	<a class=\"carousel-control right\" href=\"#myCarousel\" data-slide=\"next\">&rsaquo;</a>\n</div>\n<p>\n	This module's dependencies (js and css) are stored in the base folder. This means they are concatenated [and loaded\n	as external assets] and are always available in this base template.\n</p>";
  });

this["JST"]["foo-alternate"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "Module foo | Template alternate";
  });

this["JST"]["foo"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "Module foo<br>\n";
  if (stack1 = helpers.data) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.data; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1);
  return buffer;
  });

this["JST"]["nav-main"] = Handlebars.template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [2,'>= 1.0.0-rc.3'];
helpers = helpers || Handlebars.helpers; data = data || {};
  


  return "<span class=\"wf-label\">.mod-nav-main</span>\n<ul>\n	<li><a href=\"/\">Home</a></li>\n	<li><a href=\"/subpage\">Sub-Page</a></li>\n</ul>";
  });
debug('main.js: inline logic ready.');
