var  path = require('path')
	,express = require('express')
	,http = require('http')
	,exphbs = require('express3-handlebars')
	,hbs
	,helpers
	,handlebarsHelpers
	,app = express()
	,cfg
;

if (!process.env.NODE_ENV) {
	process.env.NODE_ENV = 'development';
}

// Merge configuration data
cfg = require('./app_modules/configure').merge('_config/', [
		 'default'
		,'project'
		,'secret'
		,'local'
	]).get();

// Share the configuration data
app.cfg = cfg;

helpers = require('./app_modules/helpers.js')(cfg);
app.terrific = require('./app_modules/terrific.js')(cfg);
// Set up template data that is always available
app.locals(helpers.makeLocals());
app.docTitle = helpers.docTitle;

// Create a configured express3-handlebars instance with our Handlbars template helpers
handlebarsHelpers = helpers.getHandlebarsHelpers();
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


app.configure(function() {
	app.set('port', process.env.PORT || cfg.devPort);
	app.use(express.logger('dev'));
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.compress());
	app.use(cfg.staticUriPrefix, express.static(cfg.pathsAbsolute.staticBaseDir));
	app.use(app.router);
});

// development only
app.configure('development', function() {
	app.use(express.errorHandler());
	app.use(express.responseTime());
});

// production only
app.configure('production', function() {});

// Load our routes from routes.js
require(cfg.pathsAbsolute.routes)(app);

// If no other middleware responds, send a 404. Defined in routes.js.
app.use(app.render404);



module.exports = app;
if (!module.parent) { // if parent exists we are in testing mode
	http.createServer(app).listen(app.get('port'), function() {
		console.log('Express server in %s mode listening on port %d', app.get('env'), app.get('port'));
	});
}
