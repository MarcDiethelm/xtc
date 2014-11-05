
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load some dependencies

var path       = require('path');
var http       = require('http');
var xtc        = !process.env.xtcDev && !process.env.testRun
               ? require('xtc')
               : require(path.join(process.cwd(), 'server.js')) // for xtc testing w/o project
var app;
var cfg;


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create an xtc Express instance

app = xtc();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set up some global stuff we need

cfg = app.xtc.cfg;

	// Add helper functions to app.xtc.helpers
require( cfg.get('helpersPath') )(app);

	// Add to global template data
app.locals({
	 siteName: cfg.get('siteName')
	,xtcVersion: cfg.get('xtcVersion')
});

	// todo:
//app.set('xtcRoutes', true);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Register server middleware with `app.use`

// see http://expressjs.com/3x/api.html#app.use
// see http://www.senchalabs.org/connect/ for descriptions of available middlewares
// Each `app.use` adds a callback to the stack. They are executed sequentially for each request.
// It's a good idea to only enable what you need for two reasons: performance and security.


app.xtc.registerProjectMiddlewares(function(express) {

	app.use(express.favicon(path.join(cfg.get('staticPath'), 'favicon.ico')));

	if ('development' === app.get('env')) {
		app.use(express.errorHandler());
		app.use(express.responseTime());
		app.use(express.logger({ format: 'dev' })); // dev style logging
	}

	if ('production' === app.get('env')) {
		app.use(express.logger('default')); // full production logging
	}

	app.use(express.compress());            // Compress response data with gzip/deflate.
	app.use(express.json());                // Parse JSON request bodies, Populates req.body.
	app.use(express.urlencoded());          // Parse x-www-form-urlencoded request bodies. Populates req.body

	// Security-related middlewares

	//app.use(express.multipart());         // File upload
	//app.use(express.cookieParser());      // Parse Cookie header and populate req.cookies
	//app.use(express.session({
	//	secret: '123', key: '456',
	//	cookie: {httpOnly: true /*, secure: true*/}
	//}));
	// For state-changing forms http://expressjs.com/3x/api.html#csrf
	// Generates a {{token}} template variable on each request
	//app.enable('csrf');

});


if ( cfg.get('allowAuthBypassForIpRanges') ) {
	// Populate the request IP with X-FORWARDED-FOR header if a proxy added one, or else the IP will be wrong.
	// Needed for authBasic helper to allow bypassing authentication for configurable IPs.
	// NOTE: This header is easily forged!
	app.enable('trust proxy');
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Register Handlebars helpers

require( cfg.get('handlebarsHelpersPath') )(app.xtc.handlebars);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listen to requests

// We don't create a server if we have a parent script (e.g. when testing).
// The function createServer and listen are defined in xtc's server.js and wrap Node's functions of the same name.
if (!module.parent) {
	// Get a Node.js httpServer object
	var server = app.xtc.createServer(app, 'http', {});

	server.listen(cfg.get('devPort'));
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

module.exports = app;
