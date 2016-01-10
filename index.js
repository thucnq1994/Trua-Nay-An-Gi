
var session				= require('express-session');
var express				= require('express');
var multer				= require('multer');
var mongoose 			= require('mongoose');
global.app				= express();
var config				= require(__dirname + '/config/config');
app.config				= config;
var Database			= require(__dirname + '/config/database.js')(app, mongoose);
var moment				= require('moment');
var bodyParser		= require('body-parser');

//Middlewares
var mwSession			= require(__dirname + '/middlewares/session');

//Controllers
var cAuth					= require(__dirname + '/controllers/auth.controller');
var cImport				= require(__dirname + '/controllers/import.controller');
var cProfile			= require(__dirname + '/controllers/profile.controller');
var cOrder				= require(__dirname + '/controllers/order.controller');
var cHistory			= require(__dirname + '/controllers/history.controller');

var cMenuManager	= require(__dirname + '/controllers/admincp/menu-manager.controller.js');


// Autoload Models
global.Server			= { Model : {} };

require('fs').readdir(__dirname + '/models/', function(err, files) {
	files.forEach(function(file) {
		if (file.match(/\.js$/) !== null) {
			var name = file.replace('.js', '');
			global.Server.Model[name] = require(__dirname + '/models/' + file)(mongoose);
		}
	});
});

// App init
var upload = multer();
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.engine('jade', require('jade').__express);
app.use(session({
	secret: '2359media',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  	extended: true
})); 


app.get('/', mwSession.getSessionData, function(req, res){
	//res.locals.test_data = 123;
	res.render('index', { data : req.currentData });
});

app.get('/login', cAuth.login);
app.get('/logout', cAuth.logout);
app.get('/gglogin', cAuth.gglogin);
app.get('/profile', mwSession.getSessionData, cProfile);
app.get('/order/:date', mwSession.getSessionData, cOrder.getMenuListByDay);
app.post('/order', mwSession.getSessionData, cOrder.orderFoodByDay);
app.get('/about', mwSession.getSessionData, function (req, res){
	res.render('about', { data : req.currentData });
});
app.get('/history', mwSession.getSessionData, function (req, res){
	res.render('history', { data : req.currentData, curDate : moment().add(1, 'days').format("DD/MM/YYYY") });
});
app.post('/history', mwSession.getSessionData, cHistory.loadMoreHistory);


app.get('/admincp/menu-manager', mwSession.getSessionData, cMenuManager.getMenuListByDay);
app.get('/admincp/menu-manager/delete/:id', mwSession.getSessionData, cMenuManager.deleteMenuById);
app.get('/admincp/menu-manager/edit/:id', mwSession.getSessionData, cMenuManager.getMenuById);
app.post('/admincp/menu-manager/edit/:id', mwSession.getSessionData, cMenuManager.editMenuById);
app.post('/admincp/menu-manager', mwSession.getSessionData, cMenuManager.getMenuListByDay);
app.get('/admincp/menu-importer', mwSession.getSessionData, cImport.getImport);
app.post('/admincp/menu-importer', mwSession.getSessionData, upload.single('xlfile'), cImport.postImport);

app.get('/test', mwSession.getSessionData,function (req, res){
	res.render('admincp/menu-manager-edit', { data : req.currentData });
});

module.exports.listen = app.listen(app.config.server.port, function(){
	var host = this.address().address;
	console.log('✔ App is listening at http://%s:%s', host, this.address().port);
});
module.exports.port = app.config.server.port;
module.exports = app;