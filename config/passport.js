var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var User = require('../models/user');

//Serialize and Deserialize
passport.serializeUser(function(user,done) {
	done(null,user._id);
	/*  only the user ID is serialized to the session, 
	keeping the amount of data stored within the session small.
	 When subsequent requests are received, 
	 this ID is used to find the user, which will be restored to req.user */

	 //In short serialize strips off uder details other than unique id, to make 
	 //user object small to be processed 
});

passport.deserializeUser(function(id,done) {
	User.findById(id,function(err,user) {
        done(err,user);
        //returns a user with id extracted by serialize function
	});
});

//Middlewares

passport.use(new localStrategy({
	usernameField: 'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req,email,password,done){
	User.findOne({email: email}, function(err,user) {
          if(err) return done(err);// If an Exception occurs during authentication like database 
          // is down, then respond with done(err)

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