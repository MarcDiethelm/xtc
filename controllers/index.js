
module.exports = function(app) {

	var siteName = app.config.siteName;
	app.settings.env == 'development' && (siteName += ' – Dev');

	// Making lang available in all render data
	app.locals({
		lang: app.config.i18n.langDefault
	});

	return {
		 // render home.hbs and include it in the default template (defined in config.js)
		home: function(req, res, next) {
			res.render('views/home', {
				layout: 'templates/layout'
				,title: siteName
				,lang: lang
				,data: 'some text'
			});
		}
		 // Render a different view
		,aSubpage: function(req, res, next) {
			res.render('views/test-modules', {
				layout: 'templates/layout'
				,title: siteName
				,lang: lang
				,data: 'some text'
			});
		}
		// Or we can just send data
		,data: function(req, res, next) {
			res.json({someParam: req.params.someParam});
		}
		// If no Express middleware sends a response this function is called.
		,render404: function(req, res, next) {
			res.status(404)
				.render(
				'views/404'
				,{
					 title: '404 – ' + siteName
					,uri: req.originalUrl
				}
			);
		}
		,appCache: function(req,res, next) {
			res.header("Content-Type", "text/cache-manifest");
			res.render('appcache', {
				layout: false
			});
		}
	}
};