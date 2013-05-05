
/**
 * Module dependencies.
 */

var  path = require('path')
	,express = require('express')
	,http = require('http')
	,hbs = require('hbs')

	,app = express()
	,NODE_ENV = app.get('env')
;

app.config = require('./app_modules/config.js');
// our base path, here.
app.config.dirName = __dirname;
app.helpers = require('./app_modules/helpers.js')(app);
// convert all relative paths in config.js to absolute paths using our base path
app.helpers.configAbsolutePaths();
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
});

http.createServer(app).listen(app.get('port'), function() {
	console.log("Express server listening on port " + app.get('port'));
});

hbs.registerHelper('env', function(name, context) {
	//  return the template only if the name matches NODE_ENV ('development', 'production', etc.)
	return name == NODE_ENV ? context.fn(this) : '';
});
// dirty single purpose partial function
// todo: clean this up!
hbs.registerPartial('inline-js', function() {
	var  fs = require('fs')
		,file = path.join(__dirname, 'frontend/_static/dist/inline.js')
	;
	try {
		console.log('read module', file)
		content = fs.readFileSync(file, 'utf8');
	} catch (e) {
		err = error('Can\'t read partial template file.', e);
		console.error(err.c);
	}
	return content;
});
// dirty single purpose partial function
// todo: clean this up!
/*hbs.registerPartial('inline-templates', function() {
	var  fs = require('fs')
		,file = path.join(__dirname, 'frontend/_static/dist/templates.jst')
	;
	try {
		console.log('read module', file)
		content = fs.readFileSync(file, 'utf8');
	} catch (e) {
		err = error('Can\'t read partial template file.', e);
		console.error(err.c);
	}
	return content;
});*/
