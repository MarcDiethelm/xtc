var log = console.log;

process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// log node version, xtc version and server mode
!process.env.testRun && log('node %s – xtc v%s – server in %s mode',
	process.version, require('./package.json').version, process.env.NODE_ENV
);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load some dependencies

var  path       = require('path')
	,express    = require('express')
	,http       = require('http')
	,cfg        = require('./lib/configure').get()
	,helpers    = require('./lib/helpers.js')

	// Create a Handlebars instance with our and the user's template helpers
	// We can then require the same instance again in lib/mod-render.js and controllers/_default.js
	,handlebars = require('./lib/handlebars-helpers-xtc.js')
	,hbs
	,app
	,xtc
;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create an Express instance

app = express();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set some globals we need later

xtc = app.xtc = {
	 cfg: cfg
	,handlebars: handlebars
	,helpers: {
		 docTitle: helpers.docTitle
		,authBasic: helpers.authBasic
		,render404: helpers.render404
	}
};

cfg = cfg.root(); // get the raw config object, so we don't have to use `get` and `set`.
// A function to join paths to xtc's root path
app.xtcPath = helpers.xtcPath;
app.projectPath = helpers.projectPath;
// Create template data that is always available
app.locals(helpers.makeLocals());


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set up template rendering

// Create a Handlebars instance with our and the user's template helpers
// We can then require the same instance again in lib/mod-render.js and controllers/_default.js
handlebars = require('./lib/handlebars-helpers-xtc.js');

hbs = require('express-handlebars').create({
	 handlebars     : handlebars
	,layoutsDir     : cfg.sources.layouts
	,defaultLayout  : cfg.defaultLayoutName
	,extname        : cfg.templateExtension
});

// Set the express-handlebars instance as rendering engine
app.engine(cfg.templateExtension, hbs.engine); // 1: template file extension, 2: engine render callback
app.set('view engine', 'hbs');
// Patch Express to look for views in multiple folders
require('./lib/multiple-view-dirs')(app);
// First look in project's views, then in xtc's views
app.set('views', [cfg.sources.views, app.xtcPath('/views')]);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Register server middleware (`app.use`)
// (see http://expressjs.com/api.html#middleware and http://www.senchalabs.org/connect/)

xtc.registerProjectMiddlewares = function(cb) {
	cb(express);

	app.use(function(req, res, next) {
		res.setHeader('X-Powered-By', 'xtc');
		next();
	});

	app.use(cfg.staticBaseUri, express.static(cfg.staticPath));
	app.use(cfg.staticBaseUri, express.static(cfg.buildBasePath)); // in case buildBasePath is different from staticPath

	// Voodoo! Set up tracking the Terrific modules included for any URIs, for module testing in the browser.
	helpers.registerModuleTestTrackingMiddleware(app);

	if (app.enabled('csrf')) {
		app.use(express.csrf());
		app.use(function(req, res, next) {
			res.locals.token = req.csrfToken();
			next();
		});
	}

	// Register project routes and xtc app routes
	require(cfg.routesPath)(app);
	require(app.xtcPath('./controllers/routes-xtc.js'))(app);

	app.use(helpers.render404); // If no other middleware responds, this last callback sends a 404.
	app.use(helpers.error); // Register a custom error handler
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listen to requests

/**
 * Returns a new web server object.
 * @param {function} app - the request listener
 * @param {string} protocol - [http|https|tcp]
 * @param {object} [options] - https or tcp server options (Node API)
 * @returns {Server} - The server function
 */
xtc.createServer = function(app, protocol, options) {
	var  server
		,server_listen
		,protocolModule
	;

	console.assert(/(http|tcp)/.test(protocol), 'Invalid arg protocol');
	protocol == 'tcp' && (protocol = 'net');
	protocolModule = require(protocol);

	server = ('http' === protocol
		? protocolModule.createServer(app)
		: protocolModule.createServer(options, app)
	);

	server.on('error', function(err) {
			// Print a nice error message if the port is in use
			if (err.code === 'EADDRINUSE') {
				var util = require('util')
					,xtcUtils = require('./lib/utils')
					,xtcErr = xtcUtils.error(
						 util.format('\n✖︎ Port %d is already in use.', app.get('port'))
						,err
						,'Quit the listening process or use a different port via config [devPort], env var [PORT] or cli arg [-p].'
					)
				;
				console.error(xtcErr.c);
				process.exit(1);
			}
			else {
				throw err; // Unhandled 'error' event
			}
		});

	server_listen = server.listen.bind(server);

	/**
	 * Listen for connections.
	 *
	 * The port is defined in cfg.devPort
	 *
	 * HTTP and HTTPS:
	 *
	 * If you run your application both as HTTP
	 * and HTTPS you may wrap them individually,
	 * since your Connect "server" is really just
	 * a JavaScript `Function`.
	 *
	 *      var xtc = require('xtc')
	 *        , http = require('http')
	 *        , https = require('https');
	 *
	 *      var app = xtc();
	 *
	 *      http.createServer(app).listen(80);
	 *      https.createServer(options, app).listen(443);
	 *
	 * @param {number} [port]
	 * @param {string} [hostname]
	 * @return {http.Server}
	 * @api public
	 */
	server.listen = function listen(port, hostname) {

		if (typeof port === 'number') {
			app.set('port', port);
		}
		else {
			console.error('\nport must be a number, got %s', port);
			process.exit(1);
		}

		server_listen(port, hostname, function() {
			!process.env.testRun && log('listening on port %d\n', port);
		});

		return server;
	};

	return server;
};


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Make a nice line of forward slashes

module.exports = function xtc() {
	return app;
};