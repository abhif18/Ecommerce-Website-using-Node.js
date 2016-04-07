var router = require('express').Router();
var User = require('../models/user');
var passport = require('passport');
var passportConfig = require('../config/passport');


router.get('/login',function(req,res) {

    if(req.user) return res.redirect('/'); // on Successfull Authentication 
    //authenticated user is stored in req.user
    res.render('accounts/login',{ message: req.flash('LoginMessage') });
});

router.post('/login',passport.authenticate('local',{
    successRedirect: '/profile',   //Route to take on Successfull Authentication
    failureRedirect: '/login',     //Route to take if Authentication Fails
    failureFlash: true             //To set Flash messages to true 
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
     		// console.log('User with email : '+req.body.email+' already exists');
     		req.flash('errors','User with that Email Already Exists');
     	return res.redirect('/signup');
     }
        else{
     	user.save(function(err,user){
     	if(err)
         return next(err);
     //following is to redirect the user to the login page if signup is successful
        req.logIn(user,function(err) {
            //req.logIn(user,function(){}); saves the cookie in browser and session object on server
            if(err) return next(err);
            return res.redirect('/profile');
        });
     });
  }
     });

});

router.get('/logout',function(req,res,next) {
    req.logout();
    res.redirect('/');
});

router.get('/edit-profile',function(req,res,next) {
   //We will render the Edit-Profile page with flash message success
   res.render('accounts/edit-profile',{message: req.flash('success')}); 
});
router.post('/edit-profile',function(req,res,next) {
    User.findOne({ _id: req.user._id },function(err,user){
          if(err) return next(err);
//if input field with name=name is selected then change the user name
          if(req.body.name) user.name = req.body.name;
//if input field with name=address is selected then change the address
        if(req.body.address) user.address = req.body.address;

        //Now Save the Updated User Object in Database
        user.save(function(err) {
            if(err) return next(err);
            req.flash('success','Successfully Updated the Profile!');
            return res.redirect('/edit-profile');
        });          
    });
});

module.exports = router;