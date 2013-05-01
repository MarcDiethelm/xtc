
module.exports = function(app) {

	var siteName = app.config.siteName
		,lang = app.config.i18n.lang
	;

	app.settings.env == 'development' && (siteName += ' – Dev');

	return {
		home: function(req, res, next) {
			// render index.hbs and include it in layout.hbs
			res.render('frontend/views/home', {
				layout: 'templates/layout'
				,title: siteName
				,lang: lang
				,data: 'some text'
			});
		}
		,test: function(req, res, next) {
			res.render('frontend/views/test-modules', {
				layout: 'templates/layout'
				,title: siteName
				,lang: lang
				,data: 'some text'
			});
		}
		,data: function(req, res, next) {
			res.json({someParam: req.params.someParam});
		}
		,appCache: function(req,res, next) {
			res.header("Content-Type", "text/cache-manifest");
			res.render('appcache', {
				layout: false
			});
		}
	}
};