var  path = require('path')
	,express = require('express')
	,http = require('http')
	,hbs = require('express3-handlebars')
	,app = express()
;


app.helpers = require('./app_modules/helpers.js')(app);
app.helpers.mergeConfigs(__dirname, '_config');
app.helpers.configAbsolutePaths();
app.helpers.shareAssetWebPathsWithLocals();
app.helpers.registerTemplateHelpers();
require('./app_modules/terrific.js')(app);

app.configure(function() {
	app.set('port', process.env.PORT || app.config.devPort);
	app.set('views', path.join( __dirname, 'frontend')); // defines a base path when getting templates
	app.set('view engine', 'hbs');
	app.set('view options', { layout: app.config.defaultTemplate });
	app.use(express.logger('dev'));
	app.use(express.favicon());
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(express.compress());
	app.use(express.static(path.join(__dirname, 'frontend/_static')));
	app.use(app.router);
});

// development only
app.configure('development', function() {
	app.use(express.errorHandler());
	app.use(express.responseTime());
});

// production only
app.configure('production', function() {});

// our routes are defined in routes.js
require(app.config.paths.routes)(app);

// If no other middleware responds, send a 404. Defined in routes.js.
app.use(app.render404);


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server in %s mode listening on port %d', app.get('env'), app.get('port'));
});
