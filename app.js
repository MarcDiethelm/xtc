/**
 * Module dependencies.
 */

var  path = require('path')
	,express = require('express')
	,http = require('http')
	,hbs = require('hbs')
	,app = express()
;

app.config = require('./app_modules/config.js');
app.config.dirName = __dirname; // the absolute path to this directory. our base path.
app.helpers = require('./app_modules/helpers.js')(app);
app.helpers.configAbsolutePaths();
app.helpers.shareAssetWebPathsWithLocals();
app.helpers.registerTemplateHelpers();
require(app.config.paths.routes)(app);
require('./app_modules/terrific.js')(app);

app.configure(function() {
	app.set('port', process.env.PORT || app.config.devPort);
	app.set('views', path.join( __dirname, 'frontend')); // defines a base path when getting templates
	app.set('view engine', 'hbs');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'frontend/_static')));
});

// development only
app.configure('development', function() {
	app.use(express.errorHandler());
	app.use(express.responseTime());
});

// production only
app.configure('production', function() {});

// If no other middleware responds, send a 404. Defined in routes.js.
app.use(app.render404);


http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server in %s mode listening on port %d', app.get('env'), app.get('port'));
});
