// ROUTES

var  express = require('express')
	,auth = express.basicAuth
	,authUser = 'admin'
	,authPsw = '03666aab1ef552643be03d238d446'
;

module.exports = function(app) {
	var index = require('./../controllers/index')(app);

	app.get('/', index.home);
	app.get('/subpage', index.aSubpage);
	app.get('/data/:someParam', auth(authUser, authPsw), index.data);
};
