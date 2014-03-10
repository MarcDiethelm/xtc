process.env.NODE_ENV = process.env.NODE_ENV || 'development';
// log node version, xtc version and server mode
process.env.NODE_ENV != 'test' && console.log('node %s – xtc v%s – server in %s mode',
	process.version, require('./package.json').xtcVersion, process.env.NODE_ENV
);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Load some dependencies

var  path       = require('path')
	,express    = require('express')
	,http       = require('http')
	,cfg        = require('./lib/configure').get()
	,helpers    = require('./lib/helpers.js')

	,handlebars
	,hbs
	,app
;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Create an Express instance

app = express();


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Set up template rendering

// Create template data that is always available
app.locals(helpers.makeLocals());

// Create a Handlebars instance with our template helpers
// We can then require the same instance again in lib/mod-render.js and controllers/_default.js
handlebars = require('./lib/handlebars-helpers-xtc.js');

hbs = require('express3-handlebars').create({
	 handlebars: handlebars
	,layoutsDir: cfg.sources.layouts
	,defaultLayout: cfg.defaultLayoutName
	,extname: cfg.templateExtension
});

// Set the express3-handlebars instance as rendering engine
app.engine('hbs', hbs.engine); // 1: template file extension, 2: engine render callback
app.set('view engine', 'hbs');
app.set('views', cfg.sources.views);


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Register server middleware (`app.use`)
// (see http://expressjs.com/api.html#middleware and http://www.senchalabs.org/connect/)


if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	app.use(express.responseTime());
}

if ('production' == app.get('env')) {}

app.use(express.favicon(path.join(cfg.staticPath, 'favicon.ico')));
app.use(express.logger( 'development' == app.get('env') && 'dev' )); // Abbreviated logging for development
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart()); // Security tip: Disable this if you don't need file upload.
app.use(express.methodOverride());
app.use(express.compress());

app.use(cfg.staticBaseUri, express.static(cfg.staticPath));
app.use(cfg.staticBaseUri, express.static(cfg.buildBasePath)); // in case buildBasePath is different from staticPath

// Voodoo! Set up tracking the Terrific modules included for any URIs, for module testing in the browser.
helpers.registerModuleTestTrackingMiddleware(app);

// Register our routes in routes.js
require(cfg.routesPath)(app);

app.use(helpers.render404); // If no other middleware responds, this last callback sends a 404.


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Listen to requests

// Store the port in the settings (Why?)
app.set('port', process.env.PORT || cfg.devPort);

if (module.parent) {
	// If parent exists we are in testing mode
	module.exports = app;
} else {
	// Server starts listening
	http.createServer(app).listen(app.get('port'), function() {
		console.log('listening on port %d\n', app.get('port'));
	});
}
