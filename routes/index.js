
var express = require('express');
var router = express.Router();
var Account = require('../models/account');
var passport = require('passport');
var flash = require('connect-flash');


router.get('/', function(req, res, next) {
  res.render('index', {
    user: req.user
  });
});

router.get('/register', function(req,res,next){
  res.render('register', {
    title: "Register",
    user: req.user
  });
});

router.post('/register', function(req,res,next){
  Account.register(new Account(
    { username: req.body.username}),
    req.body.password,
    function(err,account){
      if(err){
        console.log(err);
        res.redirect('/register');
      }
      else{
        res.redirect('/login');
      }
    });
});

router.post('/login', passport.authenticate('local',{
  successRedirect:'/contacts',
  failureRedirect:'/login',
  failureFlash:true

}));

router.get('/login', function(req,res,next){
  var messages = flash.message;
  res.render('login', {
    title: "Login",
    messages:messages,
    user: req.user
  });
});

router.get('/logout', function(req,res,next){
  req.logout();
  res.redirect('/login');
});



module.exports = router;
