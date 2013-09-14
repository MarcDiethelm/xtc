lawg.js
====

A logging and debugging helper for the browser

- It's tiny.
- Global functions for the common Firebug console.log and other methods of console if available. Those functions are:
	log,
	info,
	debug,
	error,
	dir,
	table.
- IE with Developer Tools addon provides a console object, but the log method only prints the first argument.
Lawg's window.log() will concatenate and output anything (eventually maybe) you throw at it.
- If no console object is available the concatenated arguments will be output in window.alert.
- To make logging with alerts actually useful certain objects are output with special representations.
  This is extremely helpful for debugging on mobile devices.
	- DOM elements are shown in the format: tagName[#id][.className][.className][...]
	- jQuery collections are displayed as: $([DOM element][, DOM element][...])
	- Everything else uses its native JS toString method.
- Use window._alert to bypass console logging alltogether.
- Lawg extends jQuery with a log method. Log any jQuery collection to the console/ to an alert with
		$(selector).log([@param clear Boolean]). If you set the optional parameter clear to true,
	the previous console output is cleared before logging.
- Lawg extends jQuery with an alert method. Output any jQuery collection to an alert with
		$(selector).alert()