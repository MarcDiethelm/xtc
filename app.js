process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.NODE_ENV != 'test' && console.log('node %s – xtc server in %s mode', process.version, process.env.NODE_ENV);

var  path       = require('path')
	,express    = require('express')
	,http       = require('http')
	,exphbs     = require('express3-handlebars')
	,hbs

	,cfg        = require('./lib/configure').get()
	,helpers
	,handlebarsHelpers
	,app = express()
;


if ('development' == app.get('env')) {
	app.use(express.errorHandler());
	app.use(express.responseTime());
}

if ('production' == app.get('env')) {

}


helpers = require('./lib/helpers.js')();
app.terrific = require('./lib/terrific.js')();
// Set up template data that is always available
app.locals(helpers.makeLocals());

// Create a configured express3-handlebars instance with our Handlebars template helpers
handlebarsHelpers = require('./lib/helpers-handlebars.js')();
handlebarsHelpers.mod = app.terrific.modHelper;
hbs = exphbs.create({
	 layoutsDir: cfg.paths.templates
	,defaultLayout: cfg.defaultTemplateName
	,extname: '.hbs'
	,helpers: handlebarsHelpers
});

// Set the express3-handlebars instance as rendering engine
app.engine('hbs', hbs.engine); // 1) template file extension, 2) engine render callback
app.set('view engine', 'hbs');
app.set('views', cfg.paths.views);

// The express3-handlebars instance has our template helpers. Make it available elsewhere.
app.hbs = hbs;

// Store the port in the settings (Why?)
app.set('port', process.env.PORT || cfg.devPort);

// Set up middlewares. see http://expressjs.com/api.html#middleware and http://www.senchalabs.org/connect/
app.use(express.favicon(path.join(cfg.pathsAbsolute.staticBaseDir, 'favicon.ico')));
app.use(express.logger( 'development' == app.get('env') && 'dev' )); // Abbreviated logging for development
app.use(express.json());
app.use(express.urlencoded());
app.use(express.multipart()); // Security tip: Disable this if you don't need file upload.
app.use(express.methodOverride());
app.use(express.compress());
app.use(cfg.staticUriPrefix, express.static(cfg.pathsAbsolute.staticBaseDir));
app.use(app.router);

// Set up tracking the Terrific modules included for any URIs, for module testing in the browser.
'development' == app.get('env') && helpers.registerModuleTestTrackingMiddleware(app);

// Load our routes from routes.js
require(cfg.pathsAbsolute.routes)(app);

// If no other middleware responds, this last callback sends a 404. Defined in routes.js.
app.use(app.render404);

// Export the app if this case this file was called from another script, i.e. a test
module.exports = app;
if (!module.parent) { // if parent exists we are in testing mode
	http.createServer(app).listen(app.get('port'), function() {
		console.log('listening on port %d\n', app.get('port'));
	});
}
