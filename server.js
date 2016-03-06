var express = require('express');
var morgan = require('morgan');
var mongoose = require('mongoose');
var session = require('express-session');
var secret = require('./config/secret');
var User = require('./models/user');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');
var mongoStore = require('connect-mongo/es5')(session);//To Store Session on Server Side
//coonect-mongo depends on session object thus session object needs to be passed

var passport = require('passport');

var app = express();//app refers to express object

mongoose.connect(secret.database,function(err) {
	if(err)
		console.log(err);
	else
		console.log('Connected to Database!');
});

//Middleware

app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));//To Log out the User Requests
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.engine('ejs',ejsMate);
app.set('view engine','ejs');

app.use(cookieParser(secret.secretKey));
app.use(session({
	resave: true,
	saveUninitialized: true,
	secret: secret.secretKey,
	store: new mongoStore({url: secret.database,autoReconnect :true})	
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req,res,next) {
	res.locals.user = req.user;// So that Every Route has a User Object
	next();
});

var mainRoutes = require('./routes/main');
var userRoutes = require('./routes/user');
app.use(mainRoutes);
app.use(userRoutes);





/*app.get('/',function(request,response) {
	response.json("Welcome to My ECommerce Website!");
});

app.get('/abhishek.me',function(request,response) {
	response.json("Welcome to My ECommerce Website!");
});*/

app.listen(secret.port,function(err) {
if(err) throw err;
console.log('Server is Running on port no '+secret.port);
});