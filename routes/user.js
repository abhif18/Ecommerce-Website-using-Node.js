var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');


router.get('/login',function(req,res) {

    if(req.user) return res.redirect('/');
    res.render('accounts/login',{message: req.flash('LoginMessage')});
});

router.post('/login',passport.authenticate('local',{
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/profile',function(req,res,next) {
     User.findOne({_id: req.user._id},function(err,user) {
        if(err) return next(err);
        res.render('accounts/profile',{user: user});
     });
});

router.get('/signup',function(req,res,next) {
	res.render('accounts/signup',{
		errors: req.flash('errors')
	});
});

router.post('/signup',function(req,res,next){
	console.log('received request');
	var user = new User();
     user.profile.name = req.body.name;
     user.password = req.body.password;
     user.email = req.body.email;

     User.findOne({email: req.body.email}, function(err,existinguser) {
     	if(existinguser){
     		// console.log('User with email : '+req.body+' already exists');
     		req.flash('errors','User with that Email Already Exists');
     	return res.redirect('/signup');
     }
        else{
     	user.save(function(err,user){
     	if(err)
         return next(err);
     return res.redirect('/');
     });
  }
     });

});

router.get('/logout',function(req,res,next) {
    req.logout();
    res.redirect('/');
});

module.exports = router;