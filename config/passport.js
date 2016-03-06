var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//Serialize and Deserialize
passport.serializeUser(function(user,done) {
	done(null,user._id);
});

passport.deserializeUser(function(id,done) {
	User.findById(id,function(err,user) {
        done(err,user);
	});
});

//Middlewares

passport.use(new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
	User.findOne({email: email}, function(err,user) {
          if(err) return done(err);

          if(!user)
          	return done(null, false, req.flash('LoginMessage','No Such User Exists'));

          if(!user.comparePassword(password))
          	return done(null,false,req,flash('LoginMessage','Oops Wrong Password!'));

          return done(null,user);
	});
}));


//Custom Javascript

exports.isAuthenticated = function(req,res,next){
	if(req.isAuthenticated())
		return next();

	res.redirect('/login');
}