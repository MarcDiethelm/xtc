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
